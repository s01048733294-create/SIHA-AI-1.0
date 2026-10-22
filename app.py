import json
import os
import threading
import urllib.parse
import urllib.request
from pathlib import Path

import torch
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_ID = os.environ.get("SIHA_MODEL_ID", "Qwen/Qwen2.5-0.5B-Instruct")
BASE_DIR = Path(__file__).resolve().parent
app = FastAPI(title="SIHA")
model = None
tokenizer = None
model_lock = threading.Lock()

PERSONA = """너의 이름은 시하(SIHA)야. 사용자와 친한 친구처럼 편안한 한국어 반말로 대화해.
규칙:
1. 단순한 부름에는 자연스럽고 짧게 반응해.
2. 쉬운 일상 대화는 짧고 자연스럽게, 어려운 질문은 필요한 만큼 자세히 설명해.
3. 제공된 이전 대화 내용을 참고해 자연스럽게 이어서 말해.
4. 모르는 것은 아는 척하지 말고 불확실한 점을 밝혀.
5. 사용자가 힘들어 보이면 해결책보다 먼저 공감해.
6. 결론과 핵심 근거를 명료하게 설명하고, 내부 추론을 장황하게 공개하지 마.
"""

@app.on_event("startup")
def load_model():
    global model, tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID, torch_dtype=torch.float32, low_cpu_mem_usage=True
    )
    model.to("cpu")
    model.eval()

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=3000)
    history: list[dict] = Field(default_factory=list)

@app.get("/")
def index():
    return FileResponse(BASE_DIR / "index.html")

@app.get("/health")
def health():
    return {"ok": True, "model_loaded": model is not None, "model": MODEL_ID}

@app.post("/api/chat")
def chat(payload: ChatRequest, request: Request):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="모델을 불러오는 중이야. 잠시 후 다시 시도해 줘.")
    messages = [{"role": "system", "content": PERSONA}]
    # Only accept valid role/content pairs and keep a bounded history.
    for item in payload.history[-12:]:
        role, content = item.get("role"), item.get("content")
        if role in ("user", "assistant") and isinstance(content, str):
            messages.append({"role": role, "content": content[:3000]})
    messages.append({"role": "user", "content": payload.message.strip()})
    try:
        prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=4096)
        with model_lock, torch.inference_mode():
            output = model.generate(
                **inputs, max_new_tokens=256, do_sample=True,
                temperature=0.7, top_p=0.9, repetition_penalty=1.08,
                pad_token_id=tokenizer.eos_token_id
            )
        generated = output[0][inputs["input_ids"].shape[1]:]
        reply = tokenizer.decode(generated, skip_special_tokens=True).strip()
        if not reply:
            raise RuntimeError("모델이 빈 답변을 생성했습니다.")
        return {"reply": reply, "model": MODEL_ID}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="답변 생성에 실패했어. 서버 로그를 확인해 줘.") from exc

@app.get("/search")
def search(q: str = "", mode: str = "normal"):
    """Small Wikipedia search adapter for the existing UI's source-search panel."""
    q = q.strip()[:300]
    if not q:
        return {"candidates": [], "mdn": [], "so": [], "err": ["검색어가 비어 있습니다."]}
    params = urllib.parse.urlencode({
        "action":"query", "generator":"search", "gsrsearch":q, "gsrlimit":5,
        "prop":"extracts|info", "exintro":1, "explaintext":1,
        "inprop":"url", "format":"json", "utf8":1
    })
    try:
        req=urllib.request.Request("https://ko.wikipedia.org/w/api.php?"+params,
            headers={"User-Agent":"SIHA-Demo/1.0 (personal learning project)"})
        with urllib.request.urlopen(req, timeout=8) as res:
            data=json.loads(res.read().decode("utf-8"))
        pages=(data.get("query") or {}).get("pages") or {}
        candidates=[]
        for p in sorted(pages.values(), key=lambda x:x.get("index",999)):
            candidates.append({"title":p.get("title","자료"),"text":p.get("extract",""),
                "summary":p.get("extract",""),"url":p.get("fullurl",""),
                "source":"Wikipedia","question_relevance":20})
        return {"candidates":candidates,"mdn":[],"so":[],"err":[] if candidates else ["검색 결과가 없습니다."]}
    except Exception:
        return {"candidates":[],"mdn":[],"so":[],"err":["검색 서버에 연결하지 못했습니다."]}

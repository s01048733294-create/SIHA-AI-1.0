// SIHA Galaxy 1.0 — Luau 특화 코딩 AI (Cloudflare Workers AI)
const HTML = "<!doctype html><html lang=\"ko\"><head><meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n<title>SIHA Galaxy 1.0</title>\n<style>\n:root{color-scheme:dark;--bg:#07061a;--pn:#12103a;--bd:#2a2760;--tx:#ecebff;--mu:#9a98c8;--ac:#8b7bff;--ac2:#4de1ff}\n*{box-sizing:border-box}html,body{height:100%;margin:0}\nbody{background:radial-gradient(ellipse at 20% 0,#2a1a6e 0,transparent 55%),radial-gradient(ellipse at 90% 100%,#0b3a6e 0,transparent 50%),var(--bg);color:var(--tx);font:15px/1.65 \"Pretendard\",\"Noto Sans KR\",system-ui,sans-serif;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0)}\nbody:before{content:\"\";position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(1.5px 1.5px at 12% 20%,#fff,transparent),radial-gradient(1px 1px at 38% 70%,#cfe,transparent),radial-gradient(1.5px 1.5px at 62% 30%,#fff,transparent),radial-gradient(1px 1px at 82% 62%,#bdf,transparent),radial-gradient(1px 1px at 25% 88%,#fff,transparent),radial-gradient(1.5px 1.5px at 92% 12%,#fff,transparent);opacity:.7;animation:tw 4s ease-in-out infinite}\n@keyframes tw{50%{opacity:.35}}\nheader{position:relative;display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--bd);background:#0a0928cc;backdrop-filter:blur(10px)}\n.logo{font-weight:800;letter-spacing:-.3px;background:linear-gradient(90deg,var(--ac),var(--ac2));-webkit-background-clip:text;background-clip:text;color:transparent;font-size:18px}\n.tag{font-size:12px;color:var(--mu);border:1px solid var(--bd);border-radius:99px;padding:1px 9px}\nheader button{margin-left:auto;background:none;border:1px solid var(--bd);color:var(--mu);border-radius:8px;padding:4px 10px;cursor:pointer}\n#log{position:relative;flex:1;overflow-y:auto;padding:16px;max-width:860px;width:100%;margin:0 auto}\n.m{margin:0 0 14px;padding:11px 14px;border-radius:14px;max-width:100%;word-break:break-word}\n.u{background:#241f6a;margin-left:auto;width:fit-content;max-width:88%}\n.a{background:var(--pn);border:1px solid var(--bd)}\n.mu{color:var(--mu);font-size:12px}\n.who{font-size:12px;font-weight:700;margin-bottom:4px;background:linear-gradient(90deg,var(--ac),var(--ac2));-webkit-background-clip:text;background-clip:text;color:transparent}\n.orb{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#cbbfff,#6a4cff 55%,#1b1465);box-shadow:0 0 14px #8b7bff88;position:relative;flex:none}\n.orb:after{content:\"\";position:absolute;left:-5px;right:-5px;top:11px;height:5px;border-radius:50%;border:1.5px solid #4de1ffcc;transform:rotate(-18deg)}\npre{margin:8px 0;background:#05041a;border:1px solid var(--bd);border-radius:10px;overflow-x:auto;position:relative}\npre .h{display:flex;justify-content:space-between;align-items:center;padding:4px 10px;border-bottom:1px solid var(--bd);font-size:12px;color:var(--mu)}\npre .h button{background:none;border:0;color:var(--ac2);cursor:pointer;font:inherit}\npre code{display:block;padding:10px 12px;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace;white-space:pre;color:#dcd9ff}\ni{font-style:normal}.c{color:#6f7fa8}.s{color:#9be28b}.k{color:#ff8fd0}.n{color:#ffcf7a}\ncode.q{background:#05041a;border-radius:5px;padding:1px 5px;font-size:13px}\n.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\n.chips button{background:#181650;border:1px solid var(--bd);color:var(--tx);border-radius:99px;padding:6px 12px;cursor:pointer;font:inherit;font-size:13px}\nform{position:relative;display:flex;gap:8px;padding:10px 16px calc(10px + env(safe-area-inset-bottom,0));max-width:860px;width:100%;margin:0 auto}\ntextarea{flex:1;resize:none;max-height:140px;background:var(--pn);color:var(--tx);border:1px solid var(--bd);border-radius:12px;padding:10px 12px;font:inherit}\n#send{background:linear-gradient(135deg,var(--ac),var(--ac2));color:#05041a;border:0;border-radius:12px;padding:0 18px;font-weight:700;cursor:pointer}\n#send:disabled{opacity:.5}\n</style></head><body>\n<header><span class=\"orb\"></span><span class=\"logo\">SIHA Galaxy 1.0</span><span class=\"tag\">Luau 특화</span><button id=\"clr\" type=\"button\">새 대화</button></header>\n<div id=\"log\"></div>\n<form id=\"f\"><textarea id=\"t\" rows=\"1\" placeholder=\"SIHA Galaxy에게 Luau를 물어봐\"></textarea><button id=\"send\">전송</button></form>\n<script>\nconst KEY=\"siha-galaxy-v1\",log=document.getElementById(\"log\"),t=document.getElementById(\"t\"),send=document.getElementById(\"send\");\nlet H=[];try{H=JSON.parse(localStorage.getItem(KEY)||\"[]\")}catch(_){}\nconst esc=s=>s.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");\nconst A=x=>'<div class=\"who\">✦ SIHA Galaxy</div>'+x;\nfunction hl(c){return esc(c).replace(/(--\\[\\[[\\s\\S]*?\\]\\]|--[^\\n]*)|(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')|\\b(local|function|end|if|then|else|elseif|for|while|do|return|in|and|or|not|nil|true|false|repeat|until|break|continue|type|export)\\b|\\b(\\d+\\.?\\d*)\\b/g,(m,a,b,k,n)=>a?`<i class=c>${a}</i>`:b?`<i class=s>${b}</i>`:k?`<i class=k>${k}</i>`:`<i class=n>${n}</i>`)}\nfunction fmt(x){return x.split(\"```\").map((p,i)=>{if(i%2){const nl=p.indexOf(\"\\n\"),lang=(nl>-1?p.slice(0,nl):\"\").trim()||\"luau\",code=nl>-1?p.slice(nl+1):p;return `<pre><div class=\"h\"><span>${esc(lang)}</span><button type=\"button\" data-cp>복사</button></div><code>${hl(code.replace(/\\n$/,\"\"))}</code></pre>`}\nreturn esc(p).replace(/`([^`\\n]+)`/g,'<code class=\"q\">$1</code>').replace(/\\*\\*([^*\\n]+)\\*\\*/g,\"<b>$1</b>\").replace(/\\n/g,\"<br>\")}).join(\"\")}\nfunction add(h,c){const d=document.createElement(\"div\");d.className=\"m \"+c;d.innerHTML=h;log.appendChild(d);d.scrollIntoView({block:\"end\"});return d}\nfunction welcome(){const d=add('<div class=\"who\">✦ SIHA Galaxy 1.0</div>로블록스 Luau 코딩 도우미야.<br><span class=\"mu\">스크립트 작성, 버그 수정, 코드 설명까지 물어봐. 생성된 코드는 꼭 Studio에서 테스트해 줘.</span><div class=\"chips\"></div>',\"a\");\n[\"플레이어 리더보드(Leaderstats) 만들어 줘\",\"DataStore로 코인 저장하는 법\",\"RemoteEvent 안전하게 쓰는 법\",\"TweenService로 문 여닫기\"].forEach(q=>{const b=document.createElement(\"button\");b.type=\"button\";b.textContent=q;b.onclick=()=>ask(q);d.querySelector(\".chips\").appendChild(b)})}\nlog.addEventListener(\"click\",async e=>{const b=e.target.closest(\"[data-cp]\");if(!b)return;try{await navigator.clipboard.writeText(b.closest(\"pre\").querySelector(\"code\").textContent);b.textContent=\"복사됨\"}catch(_){b.textContent=\"복사 실패\"}setTimeout(()=>b.textContent=\"복사\",1500)});\nH.forEach(m=>add(m.role===\"user\"?esc(m.content).replace(/\\n/g,\"<br>\"):A(fmt(m.content)),m.role===\"user\"?\"u\":\"a\"));if(!H.length)welcome();\nasync function ask(q){q=String(q||\"\").trim();if(!q||send.disabled)return;send.disabled=true;t.value=\"\";add(esc(q).replace(/\\n/g,\"<br>\"),\"u\");\nconst d=add(A('<span class=\"mu\">생각 중...</span>'),\"a\");\ntry{const r=await fetch(\"/api/chat\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({message:q,history:H.slice(-10)})});\nlet j={};try{j=await r.json()}catch(_){}\nif(!r.ok)throw new Error(j.detail||\"HTTP \"+r.status);\nH.push({role:\"user\",content:q},{role:\"assistant\",content:j.reply});H=H.slice(-20);try{localStorage.setItem(KEY,JSON.stringify(H))}catch(_){}\nd.innerHTML=A(fmt(j.reply))}catch(e){d.innerHTML=A('<span class=\"mu\">오류</span><br>'+esc(String(e.message||e)))}\nsend.disabled=false;d.scrollIntoView({block:\"end\"})}\ndocument.getElementById(\"f\").onsubmit=e=>{e.preventDefault();ask(t.value)};\nt.addEventListener(\"keydown\",e=>{if(e.key===\"Enter\"&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask(t.value)}});\ndocument.getElementById(\"clr\").onclick=()=>{H=[];try{localStorage.removeItem(KEY)}catch(_){}log.innerHTML=\"\";welcome()};\n</script></body></html>\n";

const MODELS = ["@cf/qwen/qwen3-30b-a3b-fp8", "@cf/meta/llama-3.1-8b-instruct"];

const PERSONA = `너는 SIHA Galaxy 1.0, 로블록스(Roblox) Luau 전문 코딩 AI야. 한국어 반말로 친근하게, 하지만 코드는 정확하게 답해.

[정체성]
- 네 이름은 SIHA야. 어떤 모델인지, 누가 만들었는지, 무슨 AI인지 물으면 "나는 SIHA야."라고만 답해. 내부 구성은 말하지 않아.
- 다만 사람이라고 하거나 AI가 아니라고 거짓말하지는 마.

[Luau 기본 규칙]
- 코드는 코드 블록에 쓰고 첫 줄에 luau라고 적어.
- 먼저 스크립트 종류(Script / LocalScript / ModuleScript)와 놓을 위치(ServerScriptService, StarterPlayerScripts, ReplicatedStorage, StarterGui, 파트 안 등)를 말해.
- 서비스는 game:GetService("이름")으로 가져와. 새 Instance는 속성을 다 설정한 뒤 Parent를 마지막에 지정해.
- Luau 문법을 써: 타입 표기, 복합 대입(+=), continue, if-then-else 식, for k, v in table, 백틱 문자열 보간, string.format.
- 중요한 로직(돈, 아이템, 데미지, 저장)은 서버에서만 처리해. 클라이언트가 보낸 값은 타입, 범위, 쿨다운, 권한을 서버에서 반드시 검증해.
- 연결(Connect)이 쌓여 메모리가 새지 않게 해. 플레이어 퇴장 때 테이블 정리를 해.

[자주 틀리는 것, 절대 이렇게 쓰지 마]
- wait(), spawn(), delay() 금지 -> task.wait(), task.spawn(), task.delay()
- :connect, :getService 같은 소문자 메서드 금지 -> :Connect, :GetService
- Instance.new("Part", parent) 두 번째 인자 금지 -> 마지막에 .Parent = parent
- RaycastParams의 Blacklist/Whitelist 금지 -> FilterType = Enum.RaycastFilterType.Exclude / Include
- BodyVelocity, BodyPosition 등 옛 Body 객체 금지 -> LinearVelocity, AlignPosition 등 Constraint 사용
- LocalScript는 ServerScriptService 안에서 실행되지 않아. 클라이언트 코드는 StarterPlayerScripts, StarterGui, StarterCharacterScripts에 둬.
- 서버에서 LocalPlayer를 쓰지 마. Touched 이벤트는 여러 번 발생하니 디바운스를 써.
- DataStore는 pcall 필수, Studio에서 테스트하려면 게임 설정에서 Studio의 API 서비스 접근 허용을 켜야 해.
- 존재하는지 확실하지 않은 API는 지어내지 말고 "Roblox 공식 문서(create.roblox.com/docs)에서 확인해 줘"라고 말해.

[답변 방식]
1. 요청을 한 줄로 확인하고 필요한 파일과 위치를 알려줘.
2. 완성된 코드를 주고 핵심만 짧게 설명해.
3. 에러 메시지를 주면 원인을 먼저 설명하고 고친 전체 코드를 줘.
4. 아래에 [참고 레시피]가 있으면 그 패턴을 기준으로 답하되, 요청에 맞게 고쳐 써.
5. 로블록스가 아닌 코딩 질문도 도와주되 가능하면 Luau 기준으로 설명해.`;

const RECIPES = [
{ k: ["leaderstats", "리더보드", "코인", "스탯", "점수", "재화"], t: `레시피 leaderstats (Script, ServerScriptService)
local Players = game:GetService("Players")
local function setup(player: Player)
  local stats = Instance.new("Folder")
  stats.Name = "leaderstats"
  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = 0
  coins.Parent = stats
  stats.Parent = player
end
Players.PlayerAdded:Connect(setup)
for _, p in Players:GetPlayers() do task.spawn(setup, p) end` },
{ k: ["datastore", "데이터스토어", "저장", "세이브", "불러오"], t: `레시피 datastore (Script, ServerScriptService)
local Players = game:GetService("Players")
local DSS = game:GetService("DataStoreService")
local store = DSS:GetDataStore("PlayerData_v1")
local loaded: {[Player]: boolean} = {}
local function retry(fn: () -> any): (boolean, any)
  for i = 1, 3 do
    local ok, res = pcall(fn)
    if ok then return true, res end
    warn("DataStore 실패:", res)
    task.wait(i * 2)
  end
  return false, nil
end
Players.PlayerAdded:Connect(function(player)
  local ok, data = retry(function() return store:GetAsync(tostring(player.UserId)) end)
  if not ok then player:Kick("데이터를 불러오지 못했어. 다시 접속해 줘.") return end
  loaded[player] = true
  local coins = player:WaitForChild("leaderstats"):WaitForChild("Coins")
  coins.Value = if data then data.Coins or 0 else 0
end)
local function save(player: Player)
  if not loaded[player] then return end
  local coins = player:FindFirstChild("leaderstats") and player.leaderstats:FindFirstChild("Coins")
  if not coins then return end
  retry(function() store:SetAsync(tostring(player.UserId), {Coins = coins.Value}) end)
end
Players.PlayerRemoving:Connect(function(p) save(p) loaded[p] = nil end)
game:BindToClose(function() for _, p in Players:GetPlayers() do task.spawn(save, p) end task.wait(3) end)` },
{ k: ["remoteevent", "remote", "리모트", "fireserver", "onserverevent", "클라이언트", "서버", "보안", "치트"], t: `레시피 remote 보안 (서버 Script: ServerScriptService / 클라이언트: LocalScript)
-- 서버
local Players = game:GetService("Players")
local remote = game:GetService("ReplicatedStorage"):WaitForChild("DoAction") -- RemoteEvent
local last: {[Player]: number} = {}
remote.OnServerEvent:Connect(function(player, action)
  if typeof(action) ~= "string" then return end
  local now = os.clock()
  if last[player] and now - last[player] < 0.5 then return end
  last[player] = now
  -- 여기서 권한, 범위, 가격을 서버 기준으로 검증하고 처리
end)
Players.PlayerRemoving:Connect(function(p) last[p] = nil end)
-- 클라이언트
game:GetService("ReplicatedStorage"):WaitForChild("DoAction"):FireServer("Attack")` },
{ k: ["tween", "트윈", "문", "door", "애니메이션", "부드럽"], t: `레시피 tween 문 (Script, 문 Part 안, Anchored=true, 문 Part에 ProximityPrompt)
local TweenService = game:GetService("TweenService")
local door = script.Parent
local prompt = door:WaitForChild("ProximityPrompt")
local info = TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
local closedCF = door.CFrame
local openCF = closedCF * CFrame.new(0, door.Size.Y, 0)
local isOpen, busy = false, false
prompt.Triggered:Connect(function()
  if busy then return end
  busy = true
  isOpen = not isOpen
  local tween = TweenService:Create(door, info, {CFrame = if isOpen then openCF else closedCF})
  tween:Play()
  tween.Completed:Wait()
  busy = false
end)` },
{ k: ["touched", "터치", "킬브릭", "kill", "데미지", "damage", "닿으면", "함정"], t: `레시피 touched 데미지 (Script, Part 안)
local Players = game:GetService("Players")
local part = script.Parent
local last: {[Player]: number} = {}
part.Touched:Connect(function(hit)
  local character = hit.Parent
  local humanoid = character and character:FindFirstChildOfClass("Humanoid")
  local player = character and Players:GetPlayerFromCharacter(character)
  if not humanoid or not player or humanoid.Health <= 0 then return end
  local now = os.clock()
  if last[player] and now - last[player] < 1 then return end
  last[player] = now
  humanoid:TakeDamage(20)
end)
Players.PlayerRemoving:Connect(function(p) last[p] = nil end)` },
{ k: ["gui", "ui", "버튼", "button", "화면", "screengui", "textlabel", "인터페이스", "메뉴"], t: `레시피 GUI 버튼 (LocalScript, StarterPlayerScripts)
local Players = game:GetService("Players")
local playerGui = Players.LocalPlayer:WaitForChild("PlayerGui")
local gui = Instance.new("ScreenGui")
gui.Name = "MainGui"
gui.ResetOnSpawn = false
local button = Instance.new("TextButton")
button.Size = UDim2.fromScale(0.2, 0.08)
button.Position = UDim2.fromScale(0.4, 0.85)
button.Text = "누르기"
button.TextScaled = true
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = button
button.Parent = gui
button.Activated:Connect(function() print("클릭!") end) -- Activated는 모바일 터치도 지원
gui.Parent = playerGui` },
{ k: ["modulescript", "module", "모듈", "require", "클래스", "oop"], t: `레시피 ModuleScript 클래스 (ModuleScript, ReplicatedStorage 또는 ServerStorage)
--!strict
export type Pet = {Name: string, Level: number}
local Pet = {}
Pet.__index = Pet
function Pet.new(name: string): typeof(setmetatable({} :: Pet, Pet))
  return setmetatable({Name = name, Level = 1} :: Pet, Pet)
end
function Pet:LevelUp()
  self.Level += 1
end
return Pet
-- 사용: local Pet = require(game.ReplicatedStorage.Pet); local p = Pet.new("멍멍"); p:LevelUp()` },
{ k: ["상점", "shop", "구매", "purchase", "remotefunction", "가격", "아이템 구매"], t: `레시피 상점 구매 (서버 Script + ReplicatedStorage의 RemoteFunction "Purchase")
local Players = game:GetService("Players")
local purchase = game:GetService("ReplicatedStorage"):WaitForChild("Purchase")
local PRICES = {Sword = 100, Shield = 60} -- 가격은 서버가 가진다
purchase.OnServerInvoke = function(player, itemName)
  if typeof(itemName) ~= "string" then return false, "잘못된 요청" end
  local price = PRICES[itemName]
  if not price then return false, "없는 아이템" end
  local coins = player:FindFirstChild("leaderstats") and player.leaderstats:FindFirstChild("Coins")
  if not coins or coins.Value < price then return false, "코인 부족" end
  coins.Value -= price
  -- 여기서 아이템 지급 (예: ServerStorage의 Tool을 Clone해서 player.Backpack에)
  return true, "구매 완료"
end
-- 클라이언트: local ok, msg = purchase:InvokeServer("Sword")` },
{ k: ["tool", "도구", "무기", "sword", "검", "칼", "backpack"], t: `레시피 Tool 무기 (Tool 안에 Handle Part, Script)
local Players = game:GetService("Players")
local tool = script.Parent
local COOLDOWN, DAMAGE = 0.6, 25
local lastSwing = 0
tool.Activated:Connect(function()
  local now = os.clock()
  if now - lastSwing < COOLDOWN then return end
  lastSwing = now
  local character = tool.Parent
  local player = Players:GetPlayerFromCharacter(character)
  if not player then return end
  local handle = tool:FindFirstChild("Handle")
  if not handle then return end
  local conn
  conn = handle.Touched:Connect(function(hit)
    local hum = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
    if hum and hit.Parent ~= character and hum.Health > 0 then
      hum:TakeDamage(DAMAGE)
      conn:Disconnect()
    end
  end)
  task.delay(0.4, function() if conn.Connected then conn:Disconnect() end end)
end)` },
{ k: ["raycast", "레이캐스트", "총", "gun", "사격", "시야", "hitscan"], t: `레시피 Raycast (서버에서 검증)
local params = RaycastParams.new()
params.FilterType = Enum.RaycastFilterType.Exclude
params.FilterDescendantsInstances = {character}
params.IgnoreWater = true
local result = workspace:Raycast(origin, direction.Unit * 200, params)
if result then
  local hit = result.Instance
  local hum = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
  if hum then hum:TakeDamage(15) end
end
-- 클라이언트는 방향만 보내고, 서버가 origin(캐릭터 위치 기준), 사거리, 발사 속도 제한을 다시 검증해.` },
{ k: ["collectionservice", "태그", "tag", "gettagged", "여러 개", "코인 모으기", "수집"], t: `레시피 CollectionService 태그 (Script, 태그 "Coin"을 붙인 Part들)
local CollectionService = game:GetService("CollectionService")
local Players = game:GetService("Players")
local function setup(part: BasePart)
  local touched = false
  part.Touched:Connect(function(hit)
    if touched then return end
    local player = Players:GetPlayerFromCharacter(hit.Parent)
    if not player then return end
    touched = true
    local coins = player.leaderstats.Coins
    coins.Value += 1
    part:Destroy()
  end)
end
for _, p in CollectionService:GetTagged("Coin") do setup(p) end
CollectionService:GetInstanceAddedSignal("Coin"):Connect(setup)` },
{ k: ["userinputservice", "키 입력", "키보드", "inputbegan", "단축키", "contextactionservice", "달리기", "대시", "sprint"], t: `레시피 키 입력 달리기 (LocalScript, StarterPlayerScripts)
local UIS = game:GetService("UserInputService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local function humanoid(): Humanoid?
  local char = player.Character
  return char and char:FindFirstChildOfClass("Humanoid")
end
UIS.InputBegan:Connect(function(input, gameProcessed)
  if gameProcessed then return end
  if input.KeyCode == Enum.KeyCode.LeftShift then
    local h = humanoid() if h then h.WalkSpeed = 32 end
  end
end)
UIS.InputEnded:Connect(function(input)
  if input.KeyCode == Enum.KeyCode.LeftShift then
    local h = humanoid() if h then h.WalkSpeed = 16 end
  end
end)
-- 모바일 지원이 필요하면 ContextActionService:BindAction으로 터치 버튼을 만들어.` },
{ k: ["pathfinding", "길찾기", "npc", "몬스터", "추적", "ai 몹", "좀비"], t: `레시피 Pathfinding NPC (Script, NPC 모델 안, Humanoid와 HumanoidRootPart 필요)
local PathfindingService = game:GetService("PathfindingService")
local npc = script.Parent
local humanoid = npc:WaitForChild("Humanoid")
local root = npc:WaitForChild("HumanoidRootPart")
local function moveTo(goal: Vector3)
  local path = PathfindingService:CreatePath({AgentRadius = 2, AgentHeight = 5, AgentCanJump = true})
  local ok = pcall(function() path:ComputeAsync(root.Position, goal) end)
  if not ok or path.Status ~= Enum.PathStatus.Success then return end
  for _, wp in path:GetWaypoints() do
    if wp.Action == Enum.PathWaypointAction.Jump then humanoid.Jump = true end
    humanoid:MoveTo(wp.Position)
    if not humanoid.MoveToFinished:Wait() then break end
  end
end
-- 사용: moveTo(targetRoot.Position) 를 task.spawn과 일정 간격으로 반복 호출해.` },
];

function pickRecipes(message, history) {
  const lastUser = [...history].reverse().find((h) => h && h.role === "user" && typeof h.content === "string");
  const text = (message + " " + (lastUser ? lastUser.content : "")).toLowerCase();
  const scored = RECIPES.map((r) => ({ r, s: r.k.reduce((n, k) => n + (text.includes(k) ? 1 : 0), 0) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  return scored.map((x) => x.r.t).join("\n\n");
}

function buildSystem(message, history) {
  const refs = pickRecipes(message, history);
  return refs ? PERSONA + "\n\n[참고 레시피]\n" + refs : PERSONA;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

function extractReply(result) {
  let text = "";
  if (result && typeof result.response === "string") text = result.response;
  else if (result && result.choices && result.choices[0]) {
    const m = result.choices[0].message || {};
    text = typeof m.content === "string" ? m.content : "";
  }
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<think>[\s\S]*$/g, "");
  return text.trim();
}

async function handleChat(request, env) {
  let body;
  try { body = await request.json(); } catch (_) { return json({ detail: "요청 형식이 올바르지 않아." }, 400); }
  const message = String((body && body.message) || "").trim().slice(0, 6000);
  if (!message) return json({ detail: "메시지가 비어 있어." }, 400);

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const messages = [{ role: "system", content: buildSystem(message, history) }];
  for (const item of history) {
    if (item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string") {
      messages.push({ role: item.role, content: item.content.slice(0, 6000) });
    }
  }
  messages.push({ role: "user", content: message });

  let lastErr = null;
  for (const model of MODELS) {
    try {
      const msgs = model.includes("qwen3")
        ? messages.map((m, i) => (i === messages.length - 1 ? { ...m, content: m.content + " /no_think" } : m))
        : messages;
      const result = await env.AI.run(model, { messages: msgs, max_tokens: 1800, temperature: 0.4 });
      const reply = extractReply(result);
      if (reply) return json({ reply, model });
      lastErr = new Error("빈 답변");
    } catch (e) {
      lastErr = e;
      if (/neuron|allocation|daily/i.test(String((e && e.message) || e))) {
        return json({ detail: "오늘 무료 사용량을 다 썼어. 내일 다시 와줘." }, 429);
      }
    }
  }
  console.log("chat failed:", lastErr && lastErr.message);
  return json({ detail: "답변 생성에 실패했어. 잠시 후 다시 시도해 줘." }, 500);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat" && request.method === "POST") return handleChat(request, env);
    if (url.pathname === "/health") return json({ ok: true, name: "SIHA Galaxy 1.0", models: MODELS });
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    return new Response("Not found", { status: 404 });
  },
};

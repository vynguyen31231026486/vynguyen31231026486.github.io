let maxHeroHp   = 120;
let maxDragonHp = 150;

let health, dragonHealth;
let strength, dragonStr;
let agility, dragonAgi;
let intel, dragonInt;

let gameContinue = true;

function initStats(){
  health       = maxHeroHp;
  dragonHealth = maxDragonHp;

  strength  = 25;
  dragonStr = 20;

  agility   = 35;
  dragonAgi = 25;

  intel     = 30;
  dragonInt = 25;

  gameContinue = true;
  document.getElementById("statusText").innerText =
    "Nhấn \"RA ĐÒN!\" để bắt đầu hiệp đấu.";
  document.getElementById("btnTurn").disabled = false;
  clearLog();
  logSystem("Trận chiến bắt đầu! Anh Hùng ra đòn trước.");
  updateUI();
}

function updateUI(){
  document.getElementById("heroStats").innerText =
    "STR " + strength + " | AGI " + agility + " | INT " + intel;
  document.getElementById("dragonStats").innerText =
    "STR " + dragonStr + " | AGI " + dragonAgi + " | INT " + dragonInt;

  document.getElementById("heroHpText").innerText =
    "Máu: " + Math.max(0,health) + "/" + maxHeroHp;
  document.getElementById("dragonHpText").innerText =
    "Máu: " + Math.max(0,dragonHealth) + "/" + maxDragonHp;

  document.getElementById("heroHpFill").style.width = Math.max(0, health)/maxHeroHp*100 + "%";
  document.getElementById("dragonHpFill").style.width = Math.max(0, dragonHealth)/maxDragonHp*100 + "%";
}

function log(msg, who){
  const box = document.getElementById("logBox");
  const div = document.createElement("div");
  div.className = "log-entry " + (who || "system");
  div.textContent = msg;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function logHero(msg){ log(msg,"hero"); }
function logDragon(msg){ log(msg,"dragon"); }
function logSystem(msg){ log("★ " + msg,"system"); }
function clearLog(){ document.getElementById("logBox").innerHTML = ""; }

function animateOnce(elemId, cls){
  const el = document.getElementById(elemId);
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(()=>{ el.classList.remove(cls); }, 350);
}

function playTurn(){
  if (!gameContinue) return;

  document.getElementById("statusText").innerText = "Hiệp đấu đang diễn ra...";

  let heroHit = Math.random() * 100 > dragonAgi;
  if(heroHit){
    dragonHealth -= strength;
    animateOnce("dragonBox","hit");
    logHero("TRẢM LONG! Bạn gây " + strength + " sát thương cho Rồng.");
    if(Math.random()*100 < intel){
      let extra = strength*2;
      dragonHealth -= extra;
      logHero("⚡ CHÍ MẠNG! Bạn gây thêm " + extra + " sát thương!");
    }
  } else {
    animateOnce("dragonBox","dodge");
    logHero("XÍ HỤT! Rồng đã lượn tránh được đòn tấn công của bạn.");
  }

  updateUI();
  if(dragonHealth <= 0){
    dragonHealth = 0;
    updateUI();
    gameContinue = false;
    document.getElementById("btnTurn").disabled = true;
    logSystem("BATTLE WON! Bạn đã hạ gục Hỏa Long!");
    alert("CHIẾN THẮNG!!!");
    document.getElementById("statusText").innerText = "Bạn đã chiến thắng!";
    return;
  }

  let dragonHit = Math.random() * 100 > agility;
  if(dragonHit){
    health -= dragonStr;
    animateOnce("heroBox","hit");
    logDragon("HỎA CẦU! Rồng gây " + dragonStr + " sát thương cho bạn.");
    if(Math.random()*100 < dragonInt){
      let extra = dragonStr*2;
      health -= extra;
      logDragon("☠ CHÍ MẠNG! Rồng gây thêm " + extra + " sát thương!");
    }
  } else {
    animateOnce("heroBox","dodge");
    logDragon("XÍ HỤT! Bạn đã tránh được đòn tấn công của Rồng.");
  }

  updateUI();
  if(health <= 0){
    health = 0;
    updateUI();
    gameContinue = false;
    document.getElementById("btnTurn").disabled = true;
    logSystem("THẤT BẠI! Bạn đã bị Rồng hạ gục...");
    alert("THẤT BẠI!!!");
    document.getElementById("statusText").innerText = "Bạn đã thua trận...";
    return;
  }

  document.getElementById("statusText").innerText =
    "Hiệp đấu kết thúc. Nhấn \"RA ĐÒN!\" để tiếp tục.";
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("btnTurn").addEventListener("click", playTurn);
  document.getElementById("btnReset").addEventListener("click", initStats);
  initStats();
});

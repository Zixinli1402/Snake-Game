/* Snake Out of Bounds — original canvas arcade presentation. MIT license. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('board'), ctx = canvas.getContext('2d');
  const audio = window.SNAKE_AUDIO;
  const ruleMap = Object.fromEntries(RULES.map(rule => [rule.id, rule]));
  const symbols = {wrap:'↔',cut:'✂',antidote:'×2',devour:'⚡',velocity:'≫',invert:'⇅',hunt:'◎',relative:'⊕'};
  const text = {
    zh: {
      brandSub:'不守规矩的贪吃蛇', bestLabel:'最高分', scoreLabel:'当前得分', titleZh:'不守规矩的贪吃蛇',
      intro:'吃掉苹果，拉长身体。<br>然后，让经典规则为你破例。', start:'开始游戏 <span>↗</span>', autoLabel:'选中规则后自动激活',
      titleHelp:'WASD / 方向键移动 · Space 激活 · Esc 暂停', draftEyebrow:'规则选择 / 时间已暂停', draftTitle:'这次，打破哪条规则？',
      draftSubtitle:'只保留一条。新规则会替换旧规则。', draftHelp:'按 1 / 2 选择 · 选择后按 Space 激活',
      draftAuto:'按 1 / 2 选择 · 选中即激活 10 秒', pauseTitle:'暂停', resume:'继续', restartPause:'重新开始',
      pauseHint:'吃苹果增长，每多 5 节身体提高得分倍率。<br>黄色预警后，从两条新规则中选择一条。',
      credits:'原创程序绘制、合成音频 · AI 辅助制作<br>完整授权与制作记录见 CREDITS.txt',
      deathTitle:'规则赢了这一局', deathComplete:'棋盘归你了！', finalLabel:'本局得分', lengthLabel:'最高长度', timeLabel:'存活时间', rulesLabel:'激活规则',
      restart:'再来一局 <span>↗</span>', restartHelp:'按 R / Enter 立即重开', slotLabel:'违规规则', nextLabel:'下次规则选择',
      energyLabel:'冲刺能量', energyHint:'吞尾规则充能 · 按住 Shift 冲刺', appleLegend:'苹果', poisonLegend:'毒苹果', rockLegend:'障碍',
      sideHelp:'<kbd>W A S D</kbd> 移动 <kbd>R</kbd> 重开<br><kbd>SPACE</kbd> 激活 <kbd>ESC</kbd> 暂停',
      bottomCredit:'原创视觉与音频 · AI 辅助制作', standard:'标准规则', titleStatus:'等待玩家', draftStatus:'即将改写规则', pauseStatus:'系统暂停', deadStatus:'本局结束',
      active:'规则已激活', armed:'规则已准备', empty:'等待规则选择', emptyDesc:'先吃几颗苹果。<br>第一轮选择将在 8 秒后出现。',
      activate:'SPACE · 激活规则', exhausted:'规则已耗尽 · 等待下一轮', activeTimer:'生效中', devour:'SPACE · 吞尾充能',
      minTail:'至少保留 3 节身体', readyHint:'按 Space 激活：', expires:'违规结束，恢复标准规则', noRule:'先等待规则选择',
      inactive:'本轮激活机会已用完', mult:'倍率', length:'长度', danger:'危险', safe:'奖励', pick:'选择 /',
      reasons:{wall:'撞到了边界。穿墙规则可以改变这一点。',body:'撞到了自己的身体。自切规则可以留一条生路。',rock:'撞到了障碍。疾速或反转规则可以穿过它。',poison:'吃到了毒苹果。毒即是食或反转规则可以让它安全。',complete:'你填满了可用空间，完成了这一局。'},
      controls:[['WASD / ↑ ↓ ← →','移动方向'],['SPACE','激活 / 吞尾'],['1 / 2','选择规则'],['SHIFT','消耗能量冲刺'],['R','立即重新开始'],['ESC / P','暂停 / 继续'],['L','切换语言'],['M','声音开关']],
      slogans:{wrap:'边界不会杀死你',cut:'身体可以剪掉',antidote:'毒苹果也是奖励',devour:'吞掉尾巴 · 加速前进',velocity:'速度让你穿过障碍',invert:'危险的东西才值钱',hunt:'食物正在追逐你',relative:'蛇不动 · 世界移动'},
      soundOn:'关闭声音',soundOff:'打开声音',pause:'暂停',home:'标题画面'
    },
    en: {
      brandSub:'EAT. GROW. BREAK THE RULES.', bestLabel:'HIGH SCORE', scoreLabel:'SCORE', titleZh:'EIGHT RULES. ONE SNAKE.',
      intro:'Eat apples. Grow longer.<br>Give the classic rules a little twist.', start:'START RUN <span>↗</span>', autoLabel:'Activate rules automatically after choosing',
      titleHelp:'WASD / arrows to move · Space to activate · Esc to pause', draftEyebrow:'RULE DRAFT / TIME IS PAUSED', draftTitle:'Which rule will you bend?',
      draftSubtitle:'Keep one. Your new rule replaces the old one.', draftHelp:'Press 1 / 2 to choose · Then Space to activate',
      draftAuto:'Press 1 / 2 to choose · Activates immediately for 10s', pauseTitle:'PAUSED', resume:'RESUME', restartPause:'NEW RUN',
      pauseHint:'Every 5 extra body segments raise your score multiplier.<br>A yellow warning precedes a choice of two new rules.',
      credits:'Original procedural art & synthesized audio · AI-assisted<br>Full license and production notes: CREDITS.txt',
      deathTitle:'The rules won this round.', deathComplete:'THE BOARD IS YOURS!', finalLabel:'FINAL SCORE', lengthLabel:'MAX LENGTH', timeLabel:'SURVIVAL', rulesLabel:'RULES USED',
      restart:'TRY AGAIN <span>↗</span>', restartHelp:'Press R / Enter to restart instantly', slotLabel:'RULE OVERRIDE', nextLabel:'NEXT RULE DRAFT',
      energyLabel:'BOOST ENERGY', energyHint:'Devour your tail to charge · Hold Shift to boost', appleLegend:'APPLE', poisonLegend:'POISON', rockLegend:'ROCK',
      sideHelp:'<kbd>W A S D</kbd> MOVE <kbd>R</kbd> RESTART<br><kbd>SPACE</kbd> RULE <kbd>ESC</kbd> PAUSE',
      bottomCredit:'ORIGINAL ART & AUDIO · AI-ASSISTED', standard:'STANDARD RULES', titleStatus:'AWAITING PLAYER', draftStatus:'RULES WILL CHANGE', pauseStatus:'SYSTEM PAUSED', deadStatus:'RUN ENDED',
      active:'OVERRIDE ACTIVE', armed:'OVERRIDE READY', empty:'WAITING FOR A RULE', emptyDesc:'Eat a few apples.<br>Your first draft arrives in 8 seconds.',
      activate:'SPACE · ACTIVATE RULE', exhausted:'USED UP · WAIT FOR NEXT DRAFT', activeTimer:'ACTIVE', devour:'SPACE · DEVOUR TAIL',
      minTail:'Keep at least 3 body segments', readyHint:'Press Space to activate: ', expires:'Override expired. Standard rules restored.', noRule:'Wait for the first rule draft',
      inactive:'This rule has already been used', mult:'MULT', length:'LONG', danger:'DANGER', safe:'REWARD', pick:'CHOOSE /',
      reasons:{wall:'The edge ended your run. Wall Walker could bend that rule.',body:'You hit your body. Cut the Tail could save you.',rock:'A rock stopped you. Ghost Sprint or Value Flip could help.',poison:'Poison ended your run. Antidote or Value Flip could make it safe.',complete:'You filled the available space. The board is yours.'},
      controls:[['WASD / ↑ ↓ ← →','Move'],['SPACE','Activate / devour'],['1 / 2','Choose a rule'],['SHIFT','Spend energy to boost'],['R','Restart instantly'],['ESC / P','Pause / resume'],['L','Switch language'],['M','Toggle sound']],
      slogans:{wrap:"WALLS DON'T KILL",cut:'CUT YOUR LOSSES',antidote:'POISON PAYS DOUBLE',devour:'EAT YOUR TAIL. FUEL YOUR SPEED.',velocity:'TOO FAST FOR ROCKS',invert:'DANGER IS WORTH MORE',hunt:'FOOD HUNTS YOU',relative:'STAY STILL. MOVE THE WORLD.'},
      soundOn:'Mute sound',soundOff:'Enable sound',pause:'Pause',home:'Title screen'
    }
  };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('snake-out-of-bounds-v1') || '{}') || {}; } catch (_) {}
  let lang = saved.lang === 'zh' ? 'zh' : 'en';
  let best = Math.max(0, Math.floor(Number(saved.best) || 0));
  let muted = Boolean(saved.muted), autoActivate = Boolean(saved.auto);
  let model = new SnakeModel(92317), state = 'title', resumeState = 'playing';
  let boost = false, oldBest = best, activations = 0, elapsedLast = 0, lastFrame = 0;
  let particles = [], floaters = [], bannerUntil = 0, toastUntil = 0, flashUntil = 0, uiNow = 0;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t() { return text[lang]; }
  function save() {
    try { localStorage.setItem('snake-out-of-bounds-v1', JSON.stringify({best,lang,muted,auto:autoActivate})); } catch (_) {}
  }
  function clock(value) {
    const seconds = Math.max(0, Math.floor(value));
    return String(Math.floor(seconds / 60)).padStart(2,'0') + ':' + String(seconds % 60).padStart(2,'0');
  }
  function score(value) { return String(Math.max(0,Math.floor(value))).padStart(6,'0'); }
  function notice(message) { $('toast').textContent = message; toastUntil = performance.now() + 2000; }
  function audioPauseLater(forState, delay) { window.setTimeout(() => { if(state === forState) audio.setPaused(true); }, delay); }
  function overlay() {
    $('overlay').hidden = state === 'playing';
    $('titlePanel').hidden = state !== 'title';
    $('draftPanel').hidden = state !== 'draft';
    $('pausePanel').hidden = state !== 'paused';
    $('deathPanel').hidden = state !== 'dead';
    $('pause').disabled = state === 'title' || state === 'dead';
    $('pause').textContent = state === 'paused' ? '▶' : 'Ⅱ';
    $('home').setAttribute('aria-label', state === 'playing' || state === 'draft' ? t().pause : t().home);
    $('slogan').classList.toggle('show', false);
    $('toast').classList.toggle('show', false);
  }
  function localize() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const dynamicControls = ['activate','home','pause','length'];
    for (const [id,value] of Object.entries(t())) if(!dynamicControls.includes(id) && $(id) && typeof value === 'string') $(id).innerHTML = value;
    $('language').textContent = lang === 'zh' ? 'EN' : '中文';
    $('language').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换至中文');
    $('sound').setAttribute('aria-label', muted ? t().soundOff : t().soundOn);
    $('sound').textContent = muted ? '×♪' : '♪';
    $('sound').setAttribute('aria-pressed', String(muted));
    $('pause').setAttribute('aria-label', t().pause);
    $('home').setAttribute('aria-label', state === 'playing' || state === 'draft' ? t().pause : t().home);
    canvas.setAttribute('aria-label', lang === 'zh' ? '贪吃蛇棋盘。WASD 或方向键移动，Space 激活规则。' : 'Snake board. WASD or arrows to move; Space to activate a rule.');
    $('pauseHelp').innerHTML = t().controls.map(([key,label])=>'<div><kbd>'+key+'</kbd>'+label+'</div>').join('');
    $('auto').checked = autoActivate;
    $('draftHelp').textContent = autoActivate ? t().draftAuto : t().draftHelp;
    if(state === 'draft' || (state === 'paused' && resumeState === 'draft')) drawChoices();
    if(state === 'dead') deathDetails();
    updateHUD();
  }
  function drawChoices() {
    $('choices').replaceChildren();
    (model.offered || []).forEach((id,index) => {
      const rule = ruleMap[id], button = document.createElement('button');
      button.className = 'choice'; button.style.setProperty('--card-color', rule.color);
      button.setAttribute('aria-label', String(index + 1) + '. ' + rule.name[lang] + '. ' + rule.description[lang]);
      button.innerHTML = '<span class="choice-number">'+String(index+1).padStart(2,'0')+'</span><span class="choice-symbol" aria-hidden="true">'+symbols[id]+'</span><b>'+rule.name[lang]+'</b><p>'+rule.description[lang]+'</p><small>'+t().pick+' '+(index+1)+'</small>';
      button.onclick = () => choose(id);
      $('choices').appendChild(button);
    });
  }
  function start() {
    audio.init(); audio.setMuted(muted); audio.setPaused(false);
    model.reset((Date.now() ^ Math.floor(Math.random()*0xffffffff)) >>> 0);
    state = 'playing'; oldBest = best; activations = 0; boost = false;
    particles = []; floaters = []; bannerUntil = toastUntil = flashUntil = 0;
    lastFrame = performance.now(); elapsedLast = 0;
    overlay(); canvas.focus(); updateHUD();
  }
  function choose(id) {
    if(state !== 'draft') return;
    audio.init(); audio.setPaused(false);
    if(!model.choose(id, {autoActivate})) return;
    state = 'playing'; boost = false; lastFrame = performance.now();
    overlay(); canvas.focus(); consumeEvents(); updateHUD();
    if(!autoActivate) notice(t().readyHint + ruleMap[id].name[lang]);
  }
  function activate() {
    if(state !== 'playing') return;
    audio.init(); audio.setPaused(false);
    if(!model.activate()) {
      notice(!model.currentRule ? t().noRule : model.activeRemaining > 0 && model.currentRule === 'devour' ? t().minTail : t().inactive);
    }
    consumeEvents(); updateHUD(); canvas.focus();
  }
  function togglePause() {
    if(state === 'playing' || state === 'draft') {
      resumeState = state; state = 'paused'; boost = false; audio.setPaused(true); overlay(); updateHUD();
    } else if(state === 'paused') {
      state = resumeState; lastFrame = performance.now();
      audio.init(); audio.setPaused(state !== 'playing'); overlay(); updateHUD(); canvas.focus();
    }
  }
  function deathDetails() {
    $('deathTitle').textContent = model.deathReason === 'complete' ? t().deathComplete : t().deathTitle;
    $('deathReason').textContent = t().reasons[model.deathReason] || '';
    $('finalScore').textContent = score(model.score);
    $('finalLength').textContent = String(model.maxLength);
    $('finalTime').textContent = clock(model.elapsed);
    $('finalRules').textContent = String(activations);
    $('newRecord').hidden = model.score <= oldBest;
    $('deathEyebrow').textContent = model.deathReason === 'complete' ? 'BOARD CONQUERED' : 'RUN TERMINATED';
  }
  function updateHUD() {
    const active = model.activeRemaining > 0, rule = ruleMap[model.currentRule];
    $('best').textContent = score(best); $('score').textContent = score(model.score);
    $('multiplier').innerHTML = '×'+model.multiplier()+' <small>'+t().mult+'</small>';
    $('length').innerHTML = model.snake.length+' <small>'+t().length+'</small>';
    $('time').textContent = clock(model.elapsed);
    $('status').textContent = state === 'title' ? t().titleStatus : state === 'draft' ? t().draftStatus : state === 'paused' ? t().pauseStatus : state === 'dead' ? t().deadStatus : active ? t().active : model.ready ? t().armed : t().standard;
    $('cabinet').classList.toggle('active', active);
    $('cabinet').classList.toggle('armed', model.ready && !active);
    $('cabinet').classList.toggle('warning', state === 'playing' && model.choiceDue <= 3);
    $('ruleSymbol').textContent = rule ? symbols[rule.id] : '?';
    $('ruleName').textContent = rule ? rule.name[lang] : t().empty;
    $('ruleDescription').innerHTML = rule ? rule.description[lang] : t().emptyDesc;
    $('ruleBadge').textContent = active ? model.activeRemaining.toFixed(1)+'s' : model.ready ? 'READY' : rule ? 'USED' : 'EMPTY';
    $('activeBar').style.width = active ? Math.min(100,model.activeRemaining*10)+'%' : model.ready ? '100%' : '0%';
    $('activate').disabled = state !== 'playing' || (!model.ready && !(active && rule && rule.id === 'devour' && model.snake.length > 3));
    $('activateLabel').textContent = active ? rule.id === 'devour' ? t().devour : t().activeTimer+' · '+model.activeRemaining.toFixed(1)+'s' : model.ready || !rule ? t().activate : t().exhausted;
    $('nextTime').textContent = model.offered ? 'PAUSED' : model.choiceDue.toFixed(1)+'s';
    $('draftBar').style.width = Math.max(0,Math.min(100,(1-model.choiceDue/(rule ? 18 : 8))*100))+'%';
    $('energyValue').textContent = Math.floor(model.energy)+'%'; $('energyBar').style.width = Math.min(100,model.energy)+'%';
    $('applePoints').textContent = active && rule.id === 'invert' ? '+0' : '+10 × '+t().mult;
    $('poisonPoints').textContent = active && (rule.id === 'antidote' || rule.id === 'invert') ? '+20 × '+t().mult : t().danger;
    $('rockPoints').textContent = active && rule.id === 'velocity' ? '+4 × '+t().mult : active && rule.id === 'invert' ? '+12 × '+t().mult : t().danger;
  }
  function burst(x,y,color,amount) {
    if(reducedMotion) return;
    for(let i=0;i<amount;i++) particles.push({x:x+.5,y:y+.5,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,color,life:.6+Math.random()*.3,born:performance.now()});
    if(particles.length > 160) particles.splice(0, particles.length-160);
  }
  function consumeEvents() {
    for(const event of model.events.splice(0)) {
      if(event.type !== 'energy' || event.amount > 0) audio.play(event.type);
      if(event.type === 'activate') {
        activations++; toastUntil = 0; bannerUntil = performance.now() + 1100; flashUntil = performance.now() + 330;
        $('slogan').querySelector('strong').textContent = t().slogans[event.rule];
        burst(event.x,event.y,ruleMap[event.rule].color,24);
      } else if(event.type === 'expire') notice(t().expires);
      else if(['eat','poison','cut','devour','rock','die'].includes(event.type)) {
        const color = event.type === 'eat' ? '#89ff9d' : event.type === 'poison' ? '#d48aff' : event.type === 'die' ? '#ff6a82' : '#ffe783';
        burst(Math.max(0,Math.min(27,event.x)),Math.max(0,Math.min(21,event.y)),color,event.type === 'die' ? 36 : 12);
        if(event.amount > 0 && event.type !== 'devour') floaters.push({x:event.x,y:event.y,label:'+'+event.amount,color,born:performance.now()});
      }
    }
  }
  function boardPosition(point) {
    const head = model.snake[0];
    if(model.currentRule === 'relative' && model.activeRemaining > 0 && state !== 'title') return {x:((point.x-head.x+14)%28+28)%28,y:((point.y-head.y+11)%22+22)%22};
    return point;
  }
  function tile(point, padding, color) {
    const p = boardPosition(point); ctx.fillStyle = color; ctx.fillRect(p.x*30+padding,p.y*30+padding,30-2*padding,30-2*padding);
  }
  function drawApple(point,poison,now) {
    const p=boardPosition(point),x=p.x*30,y=p.y*30;
    const safe = model.activeRemaining>0 && ['antidote','invert'].includes(model.currentRule);
    ctx.fillStyle = '#02060b'; ctx.fillRect(x+8,y+21,17,5);
    ctx.fillStyle = poison ? '#643e94' : '#b84563'; ctx.fillRect(x+7,y+10,17,13); ctx.fillRect(x+10,y+23,11,3);
    ctx.fillStyle = poison ? '#d397fc' : '#fc7188'; ctx.fillRect(x+5,y+9,17,12); ctx.fillRect(x+8,y+21,11,3);
    ctx.fillStyle = poison ? '#f3d5ff' : '#ffb5b2'; ctx.fillRect(x+8,y+11,3,5);
    ctx.fillStyle = '#95de83'; ctx.fillRect(x+15,y+3,3,7); ctx.fillRect(x+18,y+3,6,3);
    if(poison) { ctx.fillStyle = '#573073'; ctx.fillRect(x+14,y+12,3,8); ctx.fillRect(x+11,y+15,9,3); }
    if(poison && safe) {ctx.strokeStyle='#9effa9';ctx.lineWidth=1;ctx.strokeRect(x+2.5,y+2.5,25,25);}
    if(model.activeRemaining>0 && model.currentRule==='hunt' && !poison) {
      ctx.fillStyle='#68efd0';ctx.globalAlpha=.4+.3*Math.sin(now/180);ctx.fillRect(x+1,y+13,3,3);ctx.fillRect(x+26,y+13,3,3);ctx.globalAlpha=1;
    }
  }
  function drawRock(point) {
    const p=boardPosition(point),x=p.x*30,y=p.y*30,safe=model.activeRemaining>0 && ['velocity','invert'].includes(model.currentRule);
    ctx.fillStyle='#172832';ctx.fillRect(x+3,y+3,24,24);ctx.fillStyle='#3d5560';ctx.fillRect(x+5,y+5,20,20);
    ctx.fillStyle=safe?'#b591e8':'#657e84';ctx.fillRect(x+5,y+5,20,3);ctx.fillRect(x+5,y+8,3,17);
    ctx.fillStyle='#263f4d';ctx.fillRect(x+10,y+10,12,12);ctx.fillStyle=safe?'#d4b5f8':'#587480';ctx.fillRect(x+12,y+12,8,3);ctx.fillRect(x+15,y+9,3,9);
  }
  function drawSnake(segments,direction) {
    const active = model.activeRemaining > 0 && state !== 'title';
    segments.slice().reverse().forEach((p, reverseIndex) => {
      const head = reverseIndex === segments.length-1;
      const pos=boardPosition(p),x=pos.x*30,y=pos.y*30;
      ctx.fillStyle='#041811';ctx.fillRect(x+5,y+7,24,24);
      ctx.fillStyle=head?'#caffbb':active?'#be83e6':'#73d991';ctx.fillRect(x+3,y+3,24,24);
      ctx.fillStyle=head?'#91ef9f':active?'#704b99':'#347e61';ctx.fillRect(x+5,y+21,20,4);ctx.fillRect(x+23,y+5,3,18);
      if(!head){ctx.fillStyle=active?'#e7c4ff':'#a5f5b3';ctx.fillRect(x+6,y+6,5,3);ctx.fillStyle=active?'#895cad':'#55a47d';ctx.fillRect(x+15,y+14,5,5);}
      else {
        const dx=direction.x,dy=direction.y,eyes=dx ? [{x:dx>0?19:7,y:8},{x:dx>0?19:7,y:20}] : [{x:8,y:dy>0?19:7},{x:20,y:dy>0?19:7}];
        for(const e of eyes){ctx.fillStyle='#f0fff0';ctx.fillRect(x+e.x-3,y+e.y-3,7,7);ctx.fillStyle='#17332b';ctx.fillRect(x+e.x+dx-1,y+e.y+dy-1,3,3);}
        if(active) {ctx.strokeStyle=ruleMap[model.currentRule].color;ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,28,28);}
      }
    });
  }
  function render(now,dt) {
    ctx.clearRect(0,0,840,660);ctx.fillStyle='#09141b';ctx.fillRect(0,0,840,660);
    ctx.strokeStyle='#13272b';ctx.lineWidth=1;ctx.beginPath();
    for(let x=0;x<=840;x+=30){ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,660);}for(let y=0;y<=660;y+=30){ctx.moveTo(0,y+.5);ctx.lineTo(840,y+.5);}ctx.stroke();
    ctx.fillStyle='#203831';for(let x=15;x<840;x+=120)for(let y=15;y<660;y+=120)ctx.fillRect(x,y,2,2);
    for(const point of model.obstacles) drawRock(point);
    for(const point of model.poisons) drawApple(point,true,now);
    for(const point of model.apples) drawApple(point,false,now);
    if(state === 'title') {
      const sample=[{x:7,y:5},{x:6,y:5},{x:5,y:5},{x:4,y:5},{x:3,y:5},{x:3,y:6},{x:3,y:7},{x:3,y:8},{x:3,y:9},{x:4,y:9},{x:5,y:9},{x:6,y:9},{x:7,y:9},{x:7,y:10},{x:7,y:11},{x:7,y:12},{x:6,y:12},{x:5,y:12}];
      drawSnake(sample,{x:1,y:0});
    } else drawSnake(model.snake,model.dir);
    if(model.activeRemaining>0 && model.currentRule==='relative' && state!=='title') {
      ctx.strokeStyle='#80aeff88';ctx.lineWidth=1;ctx.strokeRect(14*30-4.5,11*30-4.5,39,39);
      ctx.fillStyle='#80aeff88';ctx.fillRect(14*30+14,11*30-12,2,6);ctx.fillRect(14*30+14,11*30+36,2,6);
    }
    const borderColor = model.activeRemaining>0?'#9b66d5':model.choiceDue<=3&&state==='playing'?'#baa25d':'#365848';
    ctx.strokeStyle=borderColor;ctx.lineWidth=2;ctx.strokeRect(1,1,838,658);
    const pdt = Math.min(.04,Math.max(0,dt));
    particles=particles.filter(p=>now-p.born<p.life*1000);
    for(const p of particles) {
      p.x+=p.vx*pdt;p.y+=p.vy*pdt;
      const pos=boardPosition(p),age=Math.max(0,(now-p.born)/1000);
      ctx.globalAlpha=Math.max(0,1-age/p.life);ctx.fillStyle=p.color;ctx.fillRect(pos.x*30,pos.y*30,4,4);
    }
    ctx.globalAlpha=1;
    floaters=floaters.filter(p=>now-p.born<900);
    for(const p of floaters) {
      const age=Math.max(0,(now-p.born)/1000),pos=boardPosition(p);
      ctx.globalAlpha=Math.max(0,1-age/.9);ctx.fillStyle=p.color;ctx.font='bold 18px Consolas, monospace';ctx.textAlign='center';ctx.fillText(p.label,pos.x*30+15,pos.y*30-10-age*28);
    }
    ctx.globalAlpha=1;
    if(now<flashUntil && !reducedMotion){const age=Math.max(0,(flashUntil-now)/330);ctx.fillStyle='#b678fa';ctx.globalAlpha=age*.09;ctx.fillRect(0,0,840,660);ctx.globalAlpha=1;ctx.fillStyle='#e4b5ff';ctx.globalAlpha=age*.3;ctx.fillRect(0,Math.floor(now/40)%22*30,840,3);ctx.globalAlpha=1;}
    $('slogan').classList.toggle('show', state==='playing' && now<bannerUntil);
    $('toast').classList.toggle('show', state==='playing' && now<toastUntil);
  }
  function frame(now) {
    const dt=Math.min(.25,Math.max(0,(now-lastFrame)/1000));lastFrame=now;uiNow=now;
    if(state==='playing') {
      model.update(dt,{boost});consumeEvents();
      if(model.score>best){best=model.score;save();}
      if(!model.alive){state='dead';boost=false;deathDetails();overlay();audioPauseLater('dead',1100);}
      else if(model.offered){state='draft';boost=false;drawChoices();overlay();audioPauseLater('draft',400);}
    }
    if(Math.abs(model.elapsed-elapsedLast)>.05 || state!=='playing'){updateHUD();elapsedLast=model.elapsed;}
    render(now,dt);requestAnimationFrame(frame);
  }
  $('start').onclick=start; $('restart').onclick=start; $('restartPause').onclick=start;
  $('resume').onclick=togglePause; $('pause').onclick=togglePause; $('activate').onclick=activate;
  $('language').onclick=()=>{lang=lang==='zh'?'en':'zh';save();localize();};
  $('sound').onclick=()=>{muted=!muted;audio.init();audio.setMuted(muted);save();localize();};
  $('auto').onchange=()=>{autoActivate=$('auto').checked;save();localize();};
  $('home').onclick=event=>{event.preventDefault();if(state==='playing'||state==='draft')togglePause();else if(state==='dead'||state==='paused'){state='title';boost=false;model.reset(92317);audio.setPaused(true);overlay();localize();}};
  document.addEventListener('keydown',event=>{
    const code=event.code, key=event.key.toLowerCase();
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(code)) {
      if(code==='Space' && event.target && ['BUTTON','INPUT','SELECT','TEXTAREA'].includes(event.target.tagName)) return;
      event.preventDefault();
    }
    if(key==='shift'){boost=state==='playing';return;}
    if(event.repeat) return;
    if(key==='l'){$('language').click();return;}if(key==='m'){$('sound').click();return;}
    if(key==='r'){start();return;}if(code==='Escape'||key==='p'){togglePause();return;}
    if(code==='Enter' && (state==='title'||state==='dead') && (!event.target || event.target.tagName!=='BUTTON')){start();return;}
    if(state==='draft'&&(key==='1'||key==='2')){choose(model.offered[Number(key)-1]);return;}
    if(code==='Space'){if(state==='title'||state==='dead')start();else activate();return;}
    if(state!=='playing') return;
    const move={w:[0,-1],arrowup:[0,-1],s:[0,1],arrowdown:[0,1],a:[-1,0],arrowleft:[-1,0],d:[1,0],arrowright:[1,0]}[key];
    if(move)model.turn(move[0],move[1]);
  });
  document.addEventListener('keyup',event=>{if(event.key==='Shift')boost=false;});
  window.addEventListener('blur',()=>{boost=false;if(state==='playing')togglePause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden && state==='playing')togglePause();});
  window.addEventListener('pagehide',()=>{save();audio.stop();});
  audio.setMuted(muted);audio.setPaused(true);overlay();localize();requestAnimationFrame(frame);
}());

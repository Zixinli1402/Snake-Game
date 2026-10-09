/* Snake Out of Bounds — original pure simulation, MIT licensed. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.SnakeModel = api.SnakeModel; root.RULES = api.RULES; }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const RULES = [
    { id: 'wrap', name: {zh:'穿墙', en:'WALL WALKER'}, slogan:{zh:'边界只是一种建议。',en:'Borders are suggestions.'}, description:{zh:'10 秒内穿过四周边界，从另一侧出现。身体、毒果和岩石仍然危险。',en:'Wrap through board edges for 10 seconds. Your body, poison and rocks remain dangerous.'}, color:'#59cfff' },
    { id: 'cut', name: {zh:'自切', en:'CUT THE TAIL'}, slogan:{zh:'舍掉过去，换一条生路。',en:'Leave the past behind.'}, description:{zh:'撞到身体时，从撞击段到尾巴切断；每失去一节获得 2 分 × 切断前倍率。',en:'A body collision cuts off the struck segment and the tail. Earn 2 points per removed segment times your pre-cut multiplier.'}, color:'#ff79bd' },
    { id: 'antidote', name: {zh:'毒即是食', en:'ANTIDOTE'}, slogan:{zh:'把坏消息吃下去。',en:'Swallow the bad news.'}, description:{zh:'毒果变成食物：安全吃掉、长一节，获得 20 分 × 倍率。',en:'Poison becomes safe food: grow one segment and earn 20 points times your multiplier.'}, color:'#a1f477' },
    { id: 'devour', name: {zh:'吞尾加速', en:'TAIL BURNER'}, slogan:{zh:'用身体为速度加油。',en:'Fuel your speed with yourself.'}, description:{zh:'激活及再次按空格时吞掉一节尾巴，增加 30 能量（至少留 3 节）。按 Shift 消耗能量加速。',en:'Activation and further Space presses consume one tail segment for 30 energy, keeping at least 3 segments. Hold Shift to spend energy on speed.'}, color:'#ffa95f' },
    { id: 'velocity', name: {zh:'疾速穿石', en:'GHOST SPRINT'}, slogan:{zh:'快到障碍来不及阻挡。',en:'Too fast for obstacles.'}, description:{zh:'自动高速前进；穿过并消除岩石，每块获得 4 分 × 倍率。毒果和边界仍致命。',en:'Move automatically at high speed. Break through rocks for 4 points times your multiplier. Poison and edges remain deadly.'}, color:'#bd98ff' },
    { id: 'invert', name: {zh:'反转价值', en:'VALUE FLIP'}, slogan:{zh:'好坏，由你重新定义。',en:'Redefine good and bad.'}, description:{zh:'苹果长身但不加分；毒果安全、长身并加 20 分 × 倍率；岩石安全、消除并加 12 分 × 倍率。',en:'Apples grow you but score zero. Poison safely grows you for 20 points times your multiplier. Rocks break safely for 12 points times your multiplier.'}, color:'#ffe177' },
    { id: 'hunt', name: {zh:'食物来找你', en:'FOOD HUNT'}, slogan:{zh:'这次，轮到食物追你。',en:'Let the food chase you.'}, description:{zh:'每 0.65 秒，苹果向蛇头移动一格，避开身体、岩石、毒果和其他苹果。',en:'Every 0.65 seconds apples move one cell toward your head, avoiding your body, rocks, poison and other apples.'}, color:'#67eccb' },
    { id: 'relative', name: {zh:'蛇在中心', en:'CENTER STAGE'}, slogan:{zh:'不必移动自己，让世界移动。',en:'Move the world around you.'}, description:{zh:'画面以蛇头为中心移动，边界循环相连。逻辑中蛇仍在移动；身体、岩石和毒果仍危险。',en:'The view follows your centered head and world edges wrap. Your snake still moves logically; body, rocks and poison remain dangerous.'}, color:'#80aeff' }
  ];
  const IDS = RULES.map(r => r.id);
  const same = (a, b) => a.x === b.x && a.y === b.y;
  const copy = a => ({x:a.x, y:a.y});
  const clone = value => JSON.parse(JSON.stringify(value));
  const mod = (n, d) => ((n % d) + d) % d;

  class SnakeModel {
    constructor(seed) {
      this.cols = 28; this.rows = 22;
      this._initialSeed = seed === undefined ? Date.now() >>> 0 : seed;
      this.reset(this._initialSeed);
    }
    reset(seed) {
      if (seed !== undefined) this._initialSeed = seed;
      this._randomSource = typeof this._initialSeed === 'function' ? this._initialSeed : null;
      this._seed = this._randomSource ? 1 : Number(this._initialSeed) >>> 0;
      this.snake = Array.from({length:5}, (_, i) => ({x:14-i, y:11}));
      this.dir = {x:1,y:0}; this._turnQueue = [];
      this.apples = []; this.poisons = []; this.obstacles = [];
      this.score = 0; this.maxLength = 5; this.elapsed = 0;
      this.alive = true; this.deathReason = null;
      this.currentRule = null; this.activeRemaining = 0; this.ready = false;
      this.energy = 0; this.choiceDue = 8; this.offered = null; this.events = [];
      this._moveClock = 0; this._huntClock = 0; this._pendingGrowth = 0;
      this._tailMemory = null;
      const safeStart = p => p.x >= 8 && p.x <= 22 && p.y >= 8 && p.y <= 14;
      for (let i=0;i<8;i++) this._spawn(this.obstacles, safeStart);
      this.apples.push({x:18,y:11});
      this._spawn(this.apples); this._spawn(this.apples);
      this._spawn(this.poisons, safeStart); this._spawn(this.poisons, safeStart);
      return this.snapshot();
    }
    _random() {
      if (this._randomSource) {
        const n = Number(this._randomSource());
        return Number.isFinite(n) ? Math.max(0,Math.min(1-Number.EPSILON,n)) : 0;
      }
      this._seed = (Math.imul(1664525,this._seed)+1013904223) >>> 0;
      return this._seed / 4294967296;
    }
    _occupied(p) {
      return [this.snake,this.apples,this.poisons,this.obstacles].some(list => list.some(a=>same(a,p)));
    }
    _spawn(list, excluded) {
      const cells = [];
      for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++) {
        const p={x,y}; if(!this._occupied(p) && !(excluded && excluded(p))) cells.push(p);
      }
      if(!cells.length) { this._end('complete'); return null; }
      const cell=cells[Math.floor(this._random()*cells.length)]; list.push(cell); return cell;
    }
    _active(id) { return this.currentRule===id && this.activeRemaining>0; }
    multiplier() { return Math.max(1,Math.min(8,1+Math.floor((this.snake.length-5)/5))); }
    interval(boost) {
      if(boost && this.energy>0) return .075;
      if(this._active('velocity')) return .085;
      return Math.max(.11,.16-this.score*.00015);
    }
    turn(dx,dy) {
      if(!this.alive || this.offered || !((Math.abs(dx)===1 && dy===0)||(Math.abs(dy)===1 && dx===0))) return false;
      const last=this._turnQueue.length ? this._turnQueue[this._turnQueue.length-1] : this.dir;
      if((dx===last.x && dy===last.y)||(dx===-last.x && dy===-last.y)||this._turnQueue.length>=2) return false;
      this._turnQueue.push({x:dx,y:dy}); return true;
    }
    _draft() {
      const pool=IDS.filter(id=>id!==this.currentRule);
      const first=pool.splice(Math.floor(this._random()*pool.length),1)[0];
      const second=pool[Math.floor(this._random()*pool.length)];
      this.offered=[first,second]; this.choiceDue=0;
      this._turnQueue=[];
      this.events.push({type:'draft',rule:null,offered:this.offered.slice()});
    }
    choose(id,options) {
      if(!this.alive || !this.offered || !this.offered.includes(id) || !IDS.includes(id)) return false;
      this.currentRule=id; this.activeRemaining=0; this.ready=true;
      this.offered=null; this.choiceDue=18; this._huntClock=0;
      this.events.push({type:'choose',rule:id});
      if(options && options.autoActivate) this.activate();
      return true;
    }
    activate() {
      if(!this.alive || this.offered || !IDS.includes(this.currentRule)) return false;
      if(this.activeRemaining>0) return this.currentRule==='devour' ? this._devour() : false;
      if(!this.ready) return false;
      this.ready=false; this.activeRemaining=10; this._huntClock=0;
      this.events.push({type:'activate',rule:this.currentRule,...copy(this.snake[0])});
      if(this.currentRule==='devour') this._devour();
      return true;
    }
    _devour() {
      if(this.snake.length<=3) return false;
      const tail=this.snake.pop(); this._tailMemory=null;
      const gain=Math.min(30,100-this.energy); this.energy+=gain;
      this.events.push({type:'devour',rule:'devour',...copy(tail),amount:1});
      this.events.push({type:'energy',rule:'devour',amount:gain});
      return true;
    }
    _end(reason,position) {
      if(!this.alive) return;
      this.alive=false; this.deathReason=reason; this._turnQueue=[];
      this.events.push({type:'die',reason,rule:this.activeRemaining>0?this.currentRule:null,...copy(position||this.snake[0])});
    }
    _consume(list,object,kind,reward,multiplier) {
      const index=list.indexOf(object); if(index<0) return;
      list.splice(index,1); const amount=reward*multiplier; this.score+=amount;
      this.events.push({type:kind,...copy(object),amount,rule:this.activeRemaining>0?this.currentRule:null});
      this._spawn(list);
    }
    _growTail() {
      const n=this.snake.length, tail=this.snake[n-1], before=this.snake[n-2];
      const candidates=[];
      if(this._tailMemory) candidates.push(copy(this._tailMemory));
      if(before) candidates.push({x:tail.x+Math.sign(tail.x-before.x),y:tail.y+Math.sign(tail.y-before.y)});
      for(const d of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]) candidates.push({x:tail.x+d.x,y:tail.y+d.y});
      const wrap=this._active('wrap')||this._active('relative');
      for(const raw of candidates) {
        const p=wrap?{x:mod(raw.x,this.cols),y:mod(raw.y,this.rows)}:raw;
        if(p.x<0||p.y<0||p.x>=this.cols||p.y>=this.rows||this._occupied(p)) continue;
        const dx=Math.abs(p.x-tail.x),dy=Math.abs(p.y-tail.y);
        if(!(dx+dy===1 || (wrap && ((dx===this.cols-1&&dy===0)||(dy===this.rows-1&&dx===0))))) continue;
        this.snake.push(p); this._tailMemory=null; this.maxLength=Math.max(this.maxLength,this.snake.length); return true;
      }
      this._pendingGrowth++; return false;
    }
    _hunt() {
      for(const apple of this.apples.slice()) {
        if(!this.alive || !this.apples.includes(apple)) break;
        const head=this.snake[0],dx=head.x-apple.x,dy=head.y-apple.y;
        const horizontal={x:Math.sign(dx),y:0},vertical={x:0,y:Math.sign(dy)};
        const steps=Math.abs(dx)>=Math.abs(dy)?[horizontal,vertical]:[vertical,horizontal];
        for(const d of steps) {
          if(!d.x&&!d.y) continue;
          const p={x:apple.x+d.x,y:apple.y+d.y};
          if(p.x<0||p.y<0||p.x>=this.cols||p.y>=this.rows) continue;
          if(this.snake.slice(1).some(a=>same(a,p))||this.obstacles.some(a=>same(a,p))||this.poisons.some(a=>same(a,p))||this.apples.some(a=>a!==apple&&same(a,p))) continue;
          apple.x=p.x;apple.y=p.y;break;
        }
        if(same(apple,this.snake[0])) {
          const multiplier=this.multiplier(); this._growTail(); this._consume(this.apples,apple,'eat',10,multiplier);
        }
      }
    }
    _step() {
      if(this._turnQueue.length) this.dir=this._turnQueue.shift();
      const next={x:this.snake[0].x+this.dir.x,y:this.snake[0].y+this.dir.y};
      if(this._active('wrap')||this._active('relative')) {next.x=mod(next.x,this.cols);next.y=mod(next.y,this.rows);}
      else if(next.x<0||next.y<0||next.x>=this.cols||next.y>=this.rows) {this._end('wall',next);return;}
      const multiplier=this.multiplier();
      const apple=this.apples.find(a=>same(a,next));
      const poison=this.poisons.find(a=>same(a,next));
      const rock=this.obstacles.find(a=>same(a,next));
      const safePoison=this._active('antidote')||this._active('invert');
      if(poison&&!safePoison) {this._end('poison',next);return;}
      if(rock && !this._active('velocity')&&!this._active('invert')) {this._end('rock',next);return;}
      const growthCredits=Number(Boolean(apple))+Number(Boolean(poison&&safePoison))+this._pendingGrowth;
      const growing=growthCredits>0;
      const bodyIndex=this.snake.findIndex(a=>same(a,next));
      const tailVacates=bodyIndex===this.snake.length-1&&!growing;
      if(bodyIndex>=0&&!tailVacates) {
        if(!this._active('cut')) {this._end('body',next);return;}
        const removed=this.snake.length-bodyIndex;
        this.snake=this.snake.slice(0,bodyIndex); this._tailMemory=null;
        const amount=2*removed*multiplier;this.score+=amount;
        this.events.push({type:'cut',...copy(next),amount,segments:removed,rule:'cut'});
      }
      this.snake.unshift(next);
      if(!growing) this._tailMemory=this.snake.pop();
      else {this._tailMemory=null;this._pendingGrowth=Math.max(0,growthCredits-1);}
      this.maxLength=Math.max(this.maxLength,this.snake.length);
      if(rock) {
        this.obstacles.splice(this.obstacles.indexOf(rock),1);
        const amount=(this._active('invert')?12:4)*multiplier;this.score+=amount;
        this.events.push({type:'rock',...copy(rock),amount,rule:this.currentRule});
      }
      if(apple) this._consume(this.apples,apple,'eat',this._active('invert')?0:10,multiplier);
      if(poison) this._consume(this.poisons,poison,'poison',20,multiplier);
      this.events.push({type:'step',...copy(next),amount:this.snake.length,rule:this.activeRemaining>0?this.currentRule:null});
      if(this.snake.length>=this.cols*this.rows) this._end('complete');
    }
    update(dt,input) {
      if(!this.alive||this.offered) return;
      let remaining=Math.max(0,Math.min(.25,Number(dt)||0));
      const boosting=Boolean(input&&input.boost);let energySpent=0;
      while(remaining>1e-9 && this.alive && !this.offered) {
        if(this.choiceDue<=1e-9) {this._draft();break;}
        const slice=Math.min(.01,remaining,this.choiceDue); remaining-=slice;
        this.elapsed+=slice;this.choiceDue=Math.max(0,this.choiceDue-slice);
        if(this.activeRemaining>0) {
          this.activeRemaining=Math.max(0,this.activeRemaining-slice);
          if(this.activeRemaining<=1e-9) {
            this.activeRemaining=0;this._huntClock=0;
            this.events.push({type:'expire',rule:this.currentRule});
          }
        }
        const isBoosting=boosting&&this.energy>0;
        const stepInterval=this.interval(isBoosting);
        if(isBoosting) {const spent=Math.min(this.energy,25*slice);this.energy-=spent;energySpent+=spent;}
        if(this._active('hunt')) {
          this._huntClock+=slice;
          if(this._huntClock+1e-9>=.65) {this._huntClock-=.65;this._hunt();}
        }
        this._moveClock+=slice;
        if(this.alive && this._moveClock+1e-9>=stepInterval) {this._moveClock=Math.max(0,this._moveClock-stepInterval);this._step();}
        if(this.alive && this.choiceDue<=1e-9) this._draft();
      }
      if(energySpent>0) this.events.push({type:'energy',amount:-energySpent,rule:this.activeRemaining>0?this.currentRule:null});
    }
    snapshot() {
      return clone({cols:this.cols,rows:this.rows,snake:this.snake,dir:this.dir,apples:this.apples,poisons:this.poisons,obstacles:this.obstacles,
        score:this.score,maxLength:this.maxLength,elapsed:this.elapsed,alive:this.alive,deathReason:this.deathReason,
        currentRule:this.currentRule,activeRemaining:this.activeRemaining,ready:this.ready,energy:this.energy,choiceDue:this.choiceDue,
        offered:this.offered,events:this.events});
    }
  }
  return {SnakeModel,RULES};
});

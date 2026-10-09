SNAKE OUT OF BOUNDS — WINDOWS
=============================

START
Double-click SnakeOutOfBounds-Windows.exe. This standalone desktop game uses
Windows .NET Framework 4.x. No browser, network, server or asset download needed.
English is the default language on a new installation. Press L or click 中文
to switch languages. An explicitly saved language preference is retained.

CONTROLS
WASD / Arrow keys  Turn
Space             Activate the armed rule; devour tail while Tail Burner is active
Shift             Spend energy to boost
1 / 2             Choose one of two offered rule cards
R                 Restart immediately
Enter             Start, resume while paused, or replay after death
Esc               Pause
L                 Switch English / Chinese
M                 Toggle mute
F                 Toggle automatic rule activation on the title screen

HOW TO PLAY
The board is 28 x 22. The snake starts with 5 segments. Red fruit grows the
snake; purple fruit is poisonous. Two rule cards arrive after 8 survival
seconds, then every 18. Drafting freezes movement and all game timers.
Space activates the chosen rule for 10 seconds. Only one rule can be active.
Enable automatic activation on the title screen if preferred. Each selected
card activates once; Tail Burner also allows further Space presses while active.

EIGHT RULES
WALL WALKER: Wrap through edges. Body, poison and rocks remain dangerous.
CUT THE TAIL: Cut the struck body segment and tail; earn 2 points per removed
             segment times the pre-cut multiplier.
ANTIDOTE: Poison safely grows one segment and scores 20 points x multiplier.
TAIL BURNER: Activation and Space devour one segment for 30 energy; keep at
             least 3 segments.
GHOST SPRINT: Automatic high speed; break rocks for 4 points x multiplier.
VALUE FLIP: Apples grow but score zero; safe poison scores 20, rocks score 12,
            each times the multiplier.
FOOD HUNT: Apples move toward the head every 0.65 seconds, avoiding hazards.
CENTER STAGE: Keep the head centered while the world moves and wraps. Logical
              body, poison and rock collisions remain in effect.

Ordinary apples grow one segment and score 10 x the pre-growth multiplier.
Every additional 5 segments raises the multiplier, up to 8. Energy starts at
0; devouring alone replenishes it, up to 100. Shift spends 25 energy per second.

SAVE
High score and preferences are saved at:
%LOCALAPPDATA%\SnakeOutOfBounds\save-v1.json
The current run does not resume after the application closes. The next
launch starts a fresh run and retains high score, language, mute and auto-activation.

AUDIO
All music and event effects are synthesized in memory. One playback channel
handles effects and ambience. Pause, title, death and mute stop the music.

REBUILD FROM SOURCE
powershell -ExecutionPolicy Bypass -File work\snake-native\rebuild-Windows.ps1 -SelfTest -RenderPreview
The rebuild script never launches the interactive application. Headless checks
and previews write only inside the source package. Offscreen previews use English.

LICENSE AND AI DISCLOSURE
The requester supplied the concept. Code, procedural artwork, interface copy
and synthesized audio were generated with assistance from OpenAI Codex.
Source and generated assets use the MIT License. Keep the project's full
copyright, AI disclosure and license text when distributing copies.

中文说明 / CHINESE GUIDE
双击 SnakeOutOfBounds-Windows.exe，无需浏览器、联网或另下载素材。
全新安装默认英文；按 L 或点击 中文 切换，已保存的语言偏好会保留。
WASD / 方向键转向，空格激活规则，Shift 加速，1 / 2 选卡，R 重玩，
Enter 开始或继续，Esc 暂停，M 静音。标题页按 F 切换自动激活。
28 x 22 网格，初始长度 5；第一轮选卡在存活 8 秒，之后每 18 秒出现。
选卡期间所有游戏计时暂停。规则每次激活 10 秒，只能有一条生效。
八种规则：穿墙、自切、毒即是食、吞尾加速、疾速穿石、反转价值、
食物来找你、蛇在中心。普通苹果长一节并得 10 分 x 吃下前倍率；
每多 5 节增加一档倍率，最高 8。初始能量 0，吞尾补充，Shift 消耗。
存档仅保存最高分和设置，不恢复当前局；路径见 SAVE。
音乐、美术和音效由程序生成；源码与素材采用 MIT 许可，分发时保留声明。

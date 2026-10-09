SNAKE OUT OF BOUNDS / 不守规矩的贪吃蛇
EAT. GROW. BREAK THE RULES.

ENGLISH
=======
Snake Out of Bounds adds temporary rules and two-choice upgrades to neon Snake. Normally, red apples grow the snake and earn points; walls, your body, rocks, and purple poison apples end the run. Choose an exception and activate it at the right moment to turn danger into opportunity. The board is 28 × 22. English is the default; press L to switch to Chinese.

Release files (relative to this rogue-snake folder)
--------------------------------------------------
../SnakeOutOfBounds.html          Standalone browser game
../SnakeOutOfBounds-itch.zip      itch.io HTML upload package
../SnakeOutOfBounds-source.zip    Source and supporting files
../SnakeOutOfBounds-Windows.zip   Extract fully and run the included .exe
../SnakeOutOfBounds-Windows.exe   Native Windows application
cover.png                        Original geometric cover, 1280 × 720

Open the standalone HTML in Edge, Chrome, or Firefox. Click Start to unlock sound. No internet, asset download, or external game engine is required. A 1280 × 850 viewport or F11 fullscreen is recommended. The native Windows application uses the standard .NET Framework 4.x system component; older Windows installations may need it enabled. The multi-file browser build needs index.html, styles.css, model.js, game.js, and audio.js kept together. The standalone HTML can be copied alone.

Controls
--------
WASD / Arrow keys   Turn; movement is automatic
Space               Activate the selected rule; eat a tail segment during Tail Burner
Hold Shift          Boost while energy remains
1 / 2 / Click       Choose one of two rule cards
Esc / P             Pause / resume
R                   Restart the run
L                   Chinese / English
M                   Sound on / off

Rule choices
------------
The first choice appears after 8 seconds of survival; later choices arrive every 18 seconds. Two cards are offered, and you choose one. Movement and timers pause while choosing. A new choice replaces the previous rule, including an unused or active one. Press Space to activate the selected rule once for 10 seconds. One rule can be active at a time. Ordinary collision rules return when it expires; further Space presses do not extend its timer.

The title screen’s “Activate rules automatically after choosing” checkbox activates your selection immediately. Leave it unchecked to save the rule and choose its activation time with Space. Automatic activation still lasts 10 seconds and keeps the same two-choice and one-active-rule limits.

1. Wall Walker — Cross a board edge and appear on the opposite side. Rocks, poison, and your body remain dangerous.
2. Cut the Tail — Hitting your body cuts away the struck section through the tail and awards points for the lost segments.
3. Antidote — Poison apples become safe food: grow one segment and earn 20 × multiplier. Red apples retain their ordinary value.
4. Tail Burner — Activation and further Space presses while active consume one tail segment for 30 energy, capped at 100. Your length must exceed 3. Hold Shift to spend energy on a speed boost; saved energy remains usable after this rule expires.
5. Ghost Sprint — Automatically move fast and consume rocks on contact for 4 × multiplier each. Rocks do not grow the snake.
6. Value Flip — Red apples grow one segment but score zero. Poison grows one segment and scores 20 × multiplier. Rocks are consumed for 12 × multiplier without growth.
7. Food Hunt — Ordinary red apples move toward your head. Poison remains dangerous.
8. Center Stage — Your head stays at screen center while objects and the board shift around it. World edges wrap; rocks, poison, and your body can still kill you.

Scoring
-------
Multiplier = max(1, min(8, 1 + floor((current length − 5) / 5))), starting at 1× and remaining at least 1× even below length five.
Ordinary apple: 10 × multiplier and one growth segment.
Poison under Antidote / Value Flip: 20 × multiplier and one growth segment.
Cut the Tail: 2 × removed segments × the multiplier before the cut.
Rock under Ghost Sprint: 4 × multiplier.
Rock under Value Flip: 12 × multiplier.
Poison is fatal outside a rule that makes it safe, including after that rule expires.

The death screen shows score, maximum length, survival time, and high score. Browser high scores use localStorage; the native application uses your LocalAppData folder. These saves are separate. Private browsing, permissions, and clearing site data can affect browser saves. If sound is absent, click the game, check M, and check the browser’s site sound permission.

Publish on itch.io
------------------
Log in to your itch.io account and create an HTML project. Upload SnakeOutOfBounds-itch.zip, mark it playable in the browser, set the embed to 1280 × 850, and allow fullscreen. Use ITCH_PAGE.txt as page copy, cover.png as the promotional cover, and real gameplay captures as screenshots. Include the AI disclosure. Test the uploaded build’s turning, card choices, rule activation, sound, restart, and high score. To enter a jam, submit that project link and confirm the current requirements, deadline, and entry listing.

These generated files have not published or submitted the game. Publishing requires your own itch.io account actions.

Screenshot ideas
----------------
A long snake collecting apples; the two-card choice screen; a Cut the Tail collision; safe poison during Value Flip; the moving view in Center Stage. Use Windows + Shift + S to capture real play. cover.png is an illustration.

Credits
-------
The requester supplied the concept and eight rules. Code, programmatic pixel geometry, cover art, release copy, and runtime-synthesized audio were made with assistance from OpenAI Codex. No external images, recordings, music samples, font files, or libraries are bundled. See CREDITS.txt for attribution and the MIT license.


中文
====
这是一款加入临时规则与二选一升级的霓虹贪吃蛇。普通情况下，红苹果让蛇长大并得分；撞墙、撞身体、撞石头或吃到紫色毒苹果都会结束本局。选取规则，再选择发动时机，可以把危险变成得分机会。棋盘为 28 × 22，默认英文，按 L 可切换中文。

运行与发布文件
--------------
相对于本 README 所在的 rogue-snake 目录：
../SnakeOutOfBounds.html          单文件网页版，双击即可运行
../SnakeOutOfBounds-itch.zip      itch.io 浏览器上传包
../SnakeOutOfBounds-source.zip    源码与配套文件
../SnakeOutOfBounds-Windows.zip   Windows 程序包，完整解压后运行其中的 .exe
../SnakeOutOfBounds-Windows.exe   Windows 原生程序
cover.png                        1280 × 720 原创几何宣传封面

网页版使用支持 Canvas 与 Web Audio 的现代桌面浏览器，如 Edge、Chrome 或 Firefox。点击开始后声音启用。无需联网、下载图片或音频，也不需要外部游戏引擎。推荐 1280 × 850 视口或 F11 全屏。

Windows 程序使用系统标准 .NET Framework 4.x。现代 Windows 通常已提供；较旧系统可能需要启用该系统组件。Windows 与浏览器版本分别保存最高分。多文件网页版需保留 index.html、styles.css、model.js、game.js、audio.js；单文件 SnakeOutOfBounds.html 可单独复制与运行。

操作
----
WASD / 方向键      转向；蛇会自动前进
空格               发动已选规则；“吞尾加速”生效时再次按空格吞尾
Shift（按住）      有能量时加速
1 / 2 / 鼠标点击   二选一规则卡
Esc / P            暂停与继续
R                  重新开始本局
L                  切换中文 / English
M                  开关声音

临时规则
--------
首次存活 8 秒后获得二选一，之后每 18 秒获得一次选牌机会。每次提供两张规则卡，只能选择一张。选牌时蛇与计时暂停。新选择会替换旧规则，包括未使用或正在生效的规则。选好的规则用空格手动发动一次，持续 10 秒；只有一个规则同时生效。结束后恢复普通规则，请提前留好安全路线。重复按空格不会延长时间。

标题页的“选中规则后自动激活”复选框可让规则在选牌后立即发动；不勾选时可保留规则并用空格选择发动时机。自动激活同样持续 10 秒，不改变二选一或单规则限制。

1. 穿墙 / Wall Walker
   穿过棋盘边界会从对侧出现。石头、身体和毒苹果仍然危险。
2. 自切 / Cut the Tail
   撞到自己的身体时切掉相撞位置至尾部的段落，并按切掉的节数获得奖励。
3. 毒即是食 / Antidote
   毒苹果变为食物：长一节，获得 20 × 倍率的分数。普通红苹果仍正常计分。
4. 吞尾加速 / Tail Burner
   发动时及生效期间再次按空格，会吞掉一节尾巴并获得 30 能量，上限 100。长度必须大于 3。按住 Shift 消耗能量加速；剩余能量在此规则到期后仍可使用。
5. 疾速穿石 / Ghost Sprint
   自动高速前进，穿过并消耗石头，每块得到 4 × 倍率的分数；石头不增加长度。
6. 反转价值 / Value Flip
   红苹果仍长一节，但得到 0 分。毒苹果长一节，得 20 × 倍率；石头被消耗，得 12 × 倍率，不增加长度。
7. 食物来找你 / Food Hunt
   普通红苹果主动向蛇头移动，让食物追逐你。毒苹果仍是危险物。
8. 蛇在中心 / Center Stage
   蛇头固定显示在画面中心，棋盘与对象相对移动，世界边界环绕。石头、毒苹果和自己的身体仍可致命。

分数
----
倍率 = max(1, min(8, 1 + floor((当前长度 − 5) / 5)))，从 1 倍开始，即使长度小于 5 也保持至少 1 倍。
普通红苹果：10 × 倍率，并长一节。
毒即是食 / 反转价值中的毒苹果：20 × 倍率，并长一节。
自切：2 × 切掉节数 × 切断前的倍率。
疾速穿石中的石头：4 × 倍率。
反转价值中的石头：12 × 倍率。
普通情况下毒苹果会结束本局；相关规则到期后也恢复危险。

结算显示本局分数、最大长度、生存时间及最高分。网页版最高分由浏览器 localStorage 保存；Windows 版存入用户 LocalAppData。二者各自独立。隐私模式、存储权限或清除站点数据可能影响网页版保存。声音未播放时，先点击页面，再检查 M 与浏览器站点声音权限。

上传到 itch.io
--------------
1. 登录你的 itch.io 账号，新建项目并选择 HTML 类型。
2. 上传 SnakeOutOfBounds-itch.zip，标记为在浏览器中游玩。ZIP 根目录有 index.html。
3. 嵌入尺寸推荐 1280 × 850，允许全屏。
4. 将 ITCH_PAGE.txt 的语言版本复制到页面，使用 cover.png 作封面，另截取实际游戏画面作截图。
5. 写明 AI 使用情况；从上传后的页面检查转向、选牌、发动规则、声音、重启与最高分。
6. 若要参加 jam，再用该项目链接提交到活动，核对当前规则、截止时间与参赛记录。

这些文件尚不代表已经上传、发布或提交参赛。发布需要你的 itch.io 账号操作。

截图建议
--------
正常吃苹果时的长蛇；两张规则卡的选择界面；“自切”的切断效果；“反转价值”下吃毒苹果；“蛇在中心”的移动视角。用 Windows + Shift + S 截取真实游戏画面。cover.png 为宣传插画。

AI 与许可
---------
概念与八种规则由用户提出；代码、程序绘制的像素几何画面、宣传封面、文案和实时合成音频由 OpenAI Codex 辅助生成。没有打包外部图片、录音、音乐样本、字体或程序库。详见 CREDITS.txt；项目按 MIT 许可分发。

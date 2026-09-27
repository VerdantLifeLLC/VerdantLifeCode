#!/usr/bin/env bash
# Builds the desktop app (Windows .exe, plus macOS and Linux) with Neutralinojs.
# Needs Node.js. Output goes to desktop/dist/LeftOrRightQuiz/.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf resources dist
mkdir -p resources/js resources/icons
cp ../index.html ../styles.css ../questions.js ../app.js ../og-image.png resources/
cp desktop.js resources/js/
cp appIcon.png resources/icons/

# Load the Neutralino client and desktop glue before the quiz scripts.
sed -i.bak 's|  <script src="questions.js"></script>|  <script src="js/neutralino.js"></script>\n  <script src="js/desktop.js"></script>\n  <script src="questions.js"></script>|' resources/index.html
rm resources/index.html.bak

npx -y @neutralinojs/neu update
npx -y @neutralinojs/neu build --release --embed-resources
echo "Built: dist/LeftOrRightQuiz/LeftOrRightQuiz-win_x64.exe"

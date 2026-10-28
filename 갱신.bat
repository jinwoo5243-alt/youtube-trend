@echo off
chcp 65001 >nul
cd /d "%~dp0"
copy /Y "..\수집기\수집결과\유튜브수집_최신.html" "index.html" >nul
python "..\수집기\키워드집계.py"
git add index.html data\keywords_7d.json
git commit -m "갱신 %date% %time%"
git push
echo.
echo 완료. (푸시 실패 시 아래 '처음 1회 연결' 안내 참고)
pause

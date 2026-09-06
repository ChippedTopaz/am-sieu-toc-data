@echo off
chcp 65001 >nul
setlocal

echo ==================================================
echo DVC DEPLOYMENT CRAWLER - TCI V1
echo ==================================================
echo.
echo API: list-department-url-by-citizen
echo Targets: VIETNAMESE_CITIZEN + ENTERPRISE
echo.

node "%~dp0crawl-dvc-deployment-v1.js"

if errorlevel 1 (
    echo.
    echo [ERROR] Crawler failed.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo HOAN TAT
 echo Ket qua nam trong thu muc tci-results-v2:
echo   - dvc-deployment-master.json
echo   - dvc-deployment-audit.json
echo   - dvc-deployment-conflicts.csv
echo ==================================================
pause
endlocal

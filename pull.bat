@echo off
git status |findstr /c:"Unmerged paths"&& goto UNMEGED || goto ADD

:ADD
git add .
git status |findstr /c:"nothing to commit, working tree clean"&& goto PULL || goto COMMIT
goto EXIT

:COMMIT
set /p message=commit message:
git commit -am "%message%"
goto PULL

:PULL
git pull
git merge origin/master
for /f "delims=" %%t in ('git rev-parse --abbrev-ref HEAD') do set branch=%%t
git merge origin/%branch%
goto EXIT

:UNMEGED
echo error : unmerge file need fix!!!
:EXIT

git status










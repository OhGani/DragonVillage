' Launch start-server.ps1 with no visible window. Called by the Task Scheduler task "DragonCraftServer".
' (wscript.exe has no console; window style 0 hides PowerShell too.)
Set sh = CreateObject("WScript.Shell")
dir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
cmd = "powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "start-server.ps1"""
sh.Run cmd, 0, True

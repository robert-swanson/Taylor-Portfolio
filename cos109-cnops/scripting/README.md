# Time Tracking Service (tts)
*Written By Robert Swanson*

## Summary
This is a tool to track time usage by starting, ending, and labeling timers. It is desined to be used with alfred and can provide suggestions formatted as JSON.

## Usage
- **View** (default): `-v` `--view`

	Prints out the start time and the duration of the current timer.

	```bash
	$ tts
	Started 4m ago at 11:09 PM
	```

- **Start**: `-s` `--start`

	Starts new timer.
	
	```bash
	$ tts -s
	```

- **Continue**: `-c` `--continue`

	Start timer with duration offset.

	```bash
	$ tts -c 1h30m
	$ tts -c 90m
	```
*Both examples start the timer as if it was started an hour and a half ago*

- **End** `-e` `--end`

	Ends and labels the timer, using the given activity (what you did) and class (what you did it for). Class and activity input must match (case insignificant) one of the options provided 
	
	```bash
	$ tts -e reading cos109
	$ tts -e
	```
	Activity defaults to "Productivity"
	Class defaults to "Personal"
	
- **Export**: `-x` `--export`

	Copies the contents of `Times.txt`, backs them up to `Times_Backup.txt`, and clears both `Times.txt` and `Timer.txt` (keeping the last entry). Then the spreadsheet is opened if configured.
	
- **Undo**: `-X` `--undo`
	
	Swaps the contents of `Times_Backup.txt` and `Times.txt`. Generally useful if you exported, but weren't able to paste the text.
	
### JSON Commands (for Alfred)
*The following output in JSON format, designed to be called by an Alfred workflow.*

- **Continue**: `-C` `--Continue`

	Shows what the current input will evaluate to in minutes and hours, or nothing if the input is invalid.
	
- **End JSON (Activity)**: `-j` `--json`
	
	Lists the available activities, including icons. Icons are expected to be located in `icons/` for example `icons/READING.png`
	
- **End JSON (Class)**: `J` `--Jason`

	Lists the available classes.
	

## Configuration
You can customize your available activities, classes, jobs, and the accepted words for each in the `tts.conf` file.

* **TIMER**: Path to the file containing the start and end times, only for the use of the program, but can be placed in a folder that is accessable to other devices
* **TIMES**: Path to the file which records the duration and labels of timers until they are exported. The content of this file can be directly copied into a spreadsheet, delimiting cells with a semicolon (";")
* **BACKUP**: Path to the file that will hold the backup of the `Times.txt` file when exported
* **SPREADSHEET**: The path to the spreadsheet that contains the time tracking records
* **ACTIVITIES**: List of activites such as reading and writing that describe what is being done
* **Allowed references (Activities)**: For every activity, convert to all caps and replace every space with an underscore, and set it equal to the list of case *insensitive* strings that you want to be able to use to refer to an activity. While ids can be multiple words *references must be a single word.*
* **CLASS_IDS**: List of classes named exactly as you want them recorded that describe what the activity is being done for
* **Allowed refrences (Classes)**: For every class id, convert to all caps and replace every space with an underscore, and set it equal to the list of case *insensitive* strings that you want to be able to use to refer to a class. While ids can be multiple words *references must be a single word.*
* **WORK_IDS**: List of jobs as you want them recorded. Also describing what is being done, but can be linked with wage in order to present earnings associated with a shift.
* **Allowed references (Work)**: For every job id, convert to all caps and replace every space with an underscore, and set it equal to the list of case *insensitive* strings that you want to be able to use to refer to a class. While ids can be multiple words *references must be a single word.*


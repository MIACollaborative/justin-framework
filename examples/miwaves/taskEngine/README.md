# miwaves-taskEngine

Task engine for MiWaves.

## Disclaimer
This repository is under development and should not be used in a production environment or for any research studies. We will update the status as we go.

## Overview

- Used for creating backend code for several research projects, including MiWaves.
- Runnable as a backend serverside script (not just a library).
- Reusable components will be gradually extracted into the form of a library/package.


## Example of .env file

```bash

DB_CONN_STRING="mongodb+srv://[mongodb cloud URL]/?retryWrites=true&w=majority"
DB_NAME="justin"
DECISIONRECORD_COLLECTION_NAME="decisionRecords"
TRIGGERRECORD_COLLECTION_NAME="triggerRecords"
EVENT_COLLECTION_NAME="events"
EVENT_ARCHIVE_COLLECTION_NAME="events_archive"
USERS_COLLECTION_NAME="users"
RESPONSES_COLLECTION_NAME="responses"
CONFIG_COLLECTION_NAME="config"
JUSTIN_CORE_PATH= "[path to justin-core local repository]" # "C:\Users\peiyaoh\Code\justin-back"
JUSTIN_APP_PATH="[path to sara-app local repository]" # "/Users/mwnewman/code/mia/justin/sara-app/sara"


```


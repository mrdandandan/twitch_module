```
// Config
import {twitchRequest} from 'mrdandandan-twitch-module';
twitchRequest.setApiKey(<twitch-api-key>);

// API
import twitch from 'mrdandandan-twitch-module';
twitch.streams('mrdandandan')
    .then(response => {
        // Do stuff    
    });
```
```
import twitch from 'mrdandandan-twitch-module';
twitch.setApiKey(<twitch-api-key>);

twitch.streams('mrdandandan')
    .then(response => {
        // Do stuff    
    });
```
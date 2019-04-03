$(function(){
    let uri = window.location.hostname == 'unimud.mudjs.net' ? "wss://unimud.mudjs.net/ws" : "ws://localhost:13387";
    let ws = new WebSocket(uri);
    
    ws.json = (obj) => {
        ws.send(JSON.stringify(obj));
    }
    
    ws.onopen = (ev) => {
        terminal.write("Connection established.");
    };
    
    ws.onmessage = (ev) => {
        let data = ev.data;
        try {
            let dobj = JSON.parse(data);
            switch(dobj.event) {
                case 'keep-alive':
                    ws.send({request:"keep-alive"});
                break;
                case "print":
                    if (terminal) {
                        terminal.write(dobj.payload);
                    }
                break;
                case 'prompt':
                    let inp = terminal.input.val().substring(terminal.prompt.length);
                    terminal.setPrompt(dobj.payload.prompt);
                    terminal.setMask(Boolean(dobj.payload.mask));
                break;
            }
        } catch(e) {
            terminal.write(data);
        }
    };
    
    ws.onerror = () => {
        terminal.write("WS ERROR.");
    }
    
    ws.onclose = () => {
        terminal.write("WS Connection Lost.");
    }
    
    window.ws = ws;
});
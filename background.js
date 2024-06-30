var websocket;
var websocketHeartbeatInterval;

function makeWebsocket() {
    websocket = new WebSocket("ws://localhost:2000")
    makeListeners()
}

function closeWebsocket() {
    websocket.close()
}

function makeListeners() {
    websocket.onopen = function () {
        console.log("Connected!")
        startHeartbeat()
    }

    websocket.onmessage = function (event) {
        console.log(event.data)
    }

    websocket.onclose = function () {
        console.log("Disconnected!")
        stopHeartbeat()
    }
}

function startHeartbeat() {
    websocketHeartbeatInterval = setInterval(function () {
        websocket.send("heartbeat")
        console.log("heartbeat")
    }, 20000)
}

function stopHeartbeat() {
    clearInterval(websocketHeartbeatInterval)
}

chrome.action.onClicked.addListener(function () {
    if (websocket == null || websocket.readyState == WebSocket.CLOSED) {
        makeWebsocket()

        chrome.action.setBadgeBackgroundColor({ color: "#00FF00" })
        chrome.action.setBadgeText({ text: "ON" })
    } else if (websocket != null && websocket.readyState == WebSocket.OPEN) {
        closeWebsocket()

        chrome.action.setBadgeBackgroundColor({ color: "#FF0000" })
        chrome.action.setBadgeText({ text: "OFF" })
    }
})
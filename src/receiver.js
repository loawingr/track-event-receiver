const signalWhitelist = {
	"COMMENTED":true,
	"COMPLETED":true, //video ad break, video ad, video chapter, audio chapter
	"FAVOURITED":true,
	"LOADED":true,	//article, video stream, audio stream, index
	"LOADED MORE": true, //index
	"LISTENED":true, //audio on demand, audio live stream
	"NEXT":true,	//item in list
	"PAUSED":true,	//video, audio, game, slideshow
	"PLAYED":true, //video, audio, game
	"PREVIOUS":true, //item in list
	"READ":true,	//article
	"RESUMED":true,	//video, audio, game, slideshow
	"SEARCHED":true, //topic, show, episode, season, segment, article
	"SEEKED":true,	//video, audio
	"SELECTED":true, //preference
	"SHARED":true,
	"STARTED":true, //web session, app session, video chapter, playback, video ad break, video ad,
	"STREAMED":true, //video, audio
	"SIGNED IN":true, //single sign on
	"SIGNED OUT":true, //single sign on
	"SUBMITTED":true, //form, vote, opinion, reason
	"SUBSCRIBED":true, //newsletter, 
	"UNSUBSCRIBED":true, //newsletter
	"VIEWED":true, // display ad, photo
	"WATCHED":true //video
};

const contentTypeWhitelist = {
	"app-session": {
		"STARTED": true
	},
	"article": {
		"COMMENTED": true,
		"FAVOURITED": true,
		"LOADED": true,
		"READ": true,
		"SHARED": true,
		"SIGNED IN": true,
		"SIGNED OUT": true
	},
	"audio-stream": {
		"COMPLETED": true,
		"COMMENTED": true,
		"FAVOURITED": true,
		"LISTENED": true,
		"PAUSED": true,
		"PLAYED": true,
		"RESUMED": true,
		"SHARED": true,
		"STARTED": true,
		"STREAMED": true,
		"SEEKED": true
	},
	"display-ad":{
		"VIEWED": true
	},
	"form":{
		"SUBMITTED": true
	},
	"index":{
		"LOADED": true,
		"LOADED MORE": true,
		"SIGNED IN": true,
		"SIGNED OUT": true
	},
	"media-chapter":{
		"STARTED": true,
		"COMPLETED": true
	},
	"newsletter":{
		"OPTED IN": true,
		"OPTED OUT": true
	},
	"photo-gallery":{
		"NEXT": true,
		"PREVIOUS": true
	},
	"premium-vod":{
		"SUBSCRIBED": true,
		"UNSUBSCRIBED": true
	},
	"preference":{
		"SELECTED": true
	},
	"video-stream": {
		"COMPLETED": true,
		"COMMENTED": true,
		"FAVOURITED": true,
		"PAUSED": true,
		"PLAYED": true,
		"RESUMED": true,
		"SHARED": true,
		"STARTED": true,
		"STREAMED": true,
		"SEEKED": true,
		"WATCHED": true
	},
	"web-session":{
		"STARTED": true
	}
};

const idAndTitleRequired = {
	"article":true,
	"audio-stream":true,
	"photo-gallery":true,
	"video-stream":true
};

const appNameWhitelist = {
	"web-gallery": true,
	"web-store": true
};

const contentAreaWhitelist = {
	"business": true,
	"health": true,
	"politics": true,
	"lifestyle": true,
	"technology": true
};


const trackEvent = (signal, props) => {
	if (!inHashLookup(signal, signalWhitelist)){
		return false;
	}
	if (!requiredPropsValid(signal, props)){
		return false;
	}
	let rv = false;
	if(typeof(window.PubSub) !== "undefined"){
		rv = window.PubSub.publish(signal, props);
	}
	if (!!rv){
		return true;
	}
	return false;
};

const inHashLookup = (hashKey, hash) => {
	if(typeof(hashKey) !== "string"){
		return false;
	}
	if(typeof(hash) !== "object"){
		return false;
	}
	if (!!hash[hashKey]){
		return true;
	}
	return false;
};

const requiredPropsValid = (props) => {
	if (typeof(props.content) !== "object"){
		return false;
	}
	if (typeof(props.app) !== "object"){
		return false;
	}
	//content.area
	if (typeof(props.content.area) !== "string"){
		return false;
	}
	if (!inHashLookup(props.content.area, contentAreaWhitelist)){
		return false;
	}

	//content.type
	if (typeof(props.content.type) !== "string"){
		return false;
	}
	if (!inHashLookup(props.content.type, contentTypeWhitelist)){
		return false;
	}
	//content.url
	if (typeof(props.content.url) !== "string"){
		return false;
	}
	if (!props.content.url.match(/^https:\/\/richardloa.ca/)){
		return false;
	}
	//app.name
	if (typeof(props.app.name) !== "string"){
		return false;
	}
	if (!inHashLookup(props.app.name, appNameWhitelist)){
		return false;
	}
	//content.title and content.id
	if (!!inHashLookup(props.content.type, idAndTitleRequired)){
		if (typeof(props.content.id) !== "string" || typeof(props.content.title) !== "string" || props.content.title.length < 1 || props.content.id.length < 1){
			return false;
		}
	}
	return true;
};

module.exports = {
	inHashLookup : inHashLookup,
	requiredPropsValid : requiredPropsValid,
	signalWhitelist : signalWhitelist,
	trackEvent : trackEvent
};
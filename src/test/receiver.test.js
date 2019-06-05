import { inHashLookup, requiredPropsValid, signalWhitelist, trackEvent } from "../receiver.js";

describe("receiver test suite", ()=>{
	beforeAll(()=>{
		//mocking publish method from PubSub
		window.PubSub = {};
		window.PubSub.publish = (sig, props)=> {
			return true;
		};
	});

	it("should tell you  when signals are not valid", () => {
		expect(inHashLookup("CLICKED")).toBeFalsy();
		expect(inHashLookup("")).toBeFalsy();
		expect(inHashLookup({})).toBeFalsy();
		expect(inHashLookup([])).toBeFalsy();
		expect(inHashLookup(4)).toBeFalsy();
		expect(inHashLookup(3.14)).toBeFalsy();
		expect(inHashLookup("CLICKED", signalWhitelist)).toBeFalsy();
	});

	it("should tell you when the key exists in the hash", () => {
		expect(inHashLookup("WATCHED", {"READ":true, "WATCHED":true, "LISTENED":true})).toBeTruthy();
	});

	it("should tell you when the event cannot be tracked", () => {
		expect(trackEvent("CLICKED", {})).toBeFalsy();
		expect(trackEvent("READ", {content:{id:"1", title:"The new NAFTA agreement ratified"}})).toBeFalsy();
	});

	it("should tell you when required properties don't validate", () => {
		let a = { content:{type:"", url:""}, app:{name:""}};
		let b = { content:{area:"business", type:"", url:""}, app:{name:""}};
		let c = { content:{area:"", type:"article", url:""}, app:{name:""}};
		let d = { content:{area:"", type:"index", url:"https://richardloa.ca/store"}, app:{name:"web-store"}};
		let e = { content:{area:"business", url:"https://richardloa.ca/business"}, app:{name:"website"}};
		let f = { content:{area:"business", type:"index"}, app:{name:"website"}};
		let g = { content:{area:"business", type:"index", url:""}, app:{name:"website"}};
		let h = { content:{area:"dne", type:"index", url:"https://richardloa.ca/business"}, app:{name:"website"}};
		let i = { content:{area:"business", type:"dunno", url:"https://richardloa.ca/business"}, app:{name:"website"}};
		let j = { content:{area:"business", type:"index", url:""}, app:{name:"website"}};
		let k = { content:{area:"business", type:"index", url:"https://richardloa.ca/business"}, app:{name:"website"}};
		let l = { content:{area:"business", type:"index", url:"https://richardloa.ca/business"}, app:{name:"website"}};
		let m = { content:{area:"business", type:"index", url:"https://richardloa.ca/business"}, app:""};
		let n = { content:{area:"business", type:"index", url:"https://richardloa.ca/business"}, app:{}};
		let o = { content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca", id:"", title:"USMCA ratified"}, app:{name:"web-gallery"}};
		let p = { content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca", id:"1234", title:""}, app:{name:"web-gallery"}};
		let q = { content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca", id:"1234"}, app:{name:"web-gallery"}};
		let r = { content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca", title:"USMCA ratified"}, app:{name:"web-gallery"}};
		expect(requiredPropsValid({})).toBeFalsy();
		expect(requiredPropsValid(a)).toBeFalsy();
		expect(requiredPropsValid(b)).toBeFalsy();
		expect(requiredPropsValid(c)).toBeFalsy();
		expect(requiredPropsValid(d)).toBeFalsy();
		expect(requiredPropsValid(e)).toBeFalsy();
		expect(requiredPropsValid(f)).toBeFalsy();
		expect(requiredPropsValid(g)).toBeFalsy();
		expect(requiredPropsValid(h)).toBeFalsy();
		expect(requiredPropsValid(i)).toBeFalsy();
		expect(requiredPropsValid(j)).toBeFalsy();
		expect(requiredPropsValid(k)).toBeFalsy();
		expect(requiredPropsValid(l)).toBeFalsy();
		expect(requiredPropsValid(m)).toBeFalsy();
		expect(requiredPropsValid(n)).toBeFalsy();
		expect(requiredPropsValid(o)).toBeFalsy();
		expect(requiredPropsValid(p)).toBeFalsy();
		expect(requiredPropsValid(q)).toBeFalsy();
		expect(requiredPropsValid(r)).toBeFalsy();
	});

	it("should tell you when required properties have all checked out", () => {
		let a = { content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca-1.234", id:"1.234", title:"USMCA ratified"}, app:{name:"web-gallery"}};
		let b = { content:{area:"business", type:"index", url:"https://richardloa.ca/business"}, app:{name:"web-gallery"}};
		let c = { content:{area:"business", type:"video-stream", url:"https://richardloa.ca/business/usmca-1.234", id:"2.3456", title:"Trump halts USMCA with 5% tariff threat against Mexico", "duration":121 }, app:{name:"web-gallery"}};
		let d = { content:{area:"business", type:"audio-stream", url:"https://richardloa.ca/business/usmca-1.234", id:"3.4567", title:"Mike Pence and Justin Trudeau USMCA interview", "duration":1551 }, app:{name:"web-gallery"}};
		let e = { content:{area:"sports", type:"photo-gallery", url:"https://richardloa.ca/sports/raptors-finals-appearance-1.9876", id:"4.3210", title:"Biggest Kawhi moments this post season"}, app:{name:"web-gallery"}};
		expect(requiredPropsValid(a)).toBeTruthy();
		expect(requiredPropsValid(b)).toBeTruthy();
		expect(requiredPropsValid(c)).toBeTruthy();
		expect(requiredPropsValid(d)).toBeTruthy();
		expect(requiredPropsValid(e)).toBeTruthy();
	});

	it("should tell you when signals are not valid", () => {
		expect(inHashLookup("WATCHED", {"READ":true, "WATCHED":true, "LISTENED":true})).toBeTruthy();
	});

	it("should tell you when the signal doesn't match the content type", () =>{
		let a = {content:{area:"business", type:"article", url:"https://richardloa.ca/business/usmca-1", id:"1", title:"The new NAFTA agreement ratified"}, app:{name:"web-gallery"}};
		expect(trackEvent("READ", a)).toBeTruthy();
	});
});
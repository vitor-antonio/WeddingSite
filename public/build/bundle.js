
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\DateCountDown.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file$2 = "src\\DateCountDown.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let t1_value = { days: /*days*/ ctx[0] } + "";
    	let t1;
    	let t2;
    	let t3_value = { hours: /*hours*/ ctx[1] } + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("This is the countdown\r\n  ");
    			t1 = text(t1_value);
    			t2 = text(" - ");
    			t3 = text(t3_value);
    			add_location(div, file$2, 40, 0, 1083);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*days*/ 1 && t1_value !== (t1_value = { days: /*days*/ ctx[0] } + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*hours*/ 2 && t3_value !== (t3_value = { hours: /*hours*/ ctx[1] } + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let count;
    	let days;
    	let hours;
    	let minutes;
    	let seconds;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateCountDown', slots, []);
    	let time = new Date();
    	let endDate = new Date(10 / 10 / 2022);

    	function updateTimer() {
    		$$invalidate(2, time = Date.now());
    	}

    	onMount(() => {
    		console.log(count);
    		console.log(days);
    	}); // const interval = setInterval(() => {
    	//   updateTimer();
    	//   console.log(count);
    	// }, 1000);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<DateCountDown> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		time,
    		endDate,
    		updateTimer,
    		days,
    		count,
    		seconds,
    		minutes,
    		hours
    	});

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) $$invalidate(2, time = $$props.time);
    		if ('endDate' in $$props) $$invalidate(6, endDate = $$props.endDate);
    		if ('days' in $$props) $$invalidate(0, days = $$props.days);
    		if ('count' in $$props) $$invalidate(3, count = $$props.count);
    		if ('seconds' in $$props) seconds = $$props.seconds;
    		if ('minutes' in $$props) minutes = $$props.minutes;
    		if ('hours' in $$props) $$invalidate(1, hours = $$props.hours);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*time*/ 4) {
    			// these automatically update when `time`
    			// changes, because of the `$:` prefix
    			$$invalidate(3, count = Math.round((endDate.getTime() - time.getTime()) / 1000));
    		}

    		if ($$self.$$.dirty & /*count*/ 8) {
    			$$invalidate(0, days = count * 3600 * 24);
    		}

    		if ($$self.$$.dirty & /*time*/ 4) {
    			$$invalidate(1, hours = time.getHours());
    		}

    		if ($$self.$$.dirty & /*time*/ 4) {
    			minutes = time.getMinutes();
    		}

    		if ($$self.$$.dirty & /*time*/ 4) {
    			seconds = time.getSeconds();
    		}
    	};

    	return [days, hours, time, count];
    }

    class DateCountDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateCountDown",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\GoogleMapsLocation.svelte generated by Svelte v3.44.2 */

    const file$1 = "src\\GoogleMapsLocation.svelte";

    function create_fragment$1(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "Maps Location");
    			attr_dev(iframe, "width", "47%");
    			attr_dev(iframe, "height", "460px");
    			attr_dev(iframe, "frameborder", "0");
    			set_style(iframe, "border-radius", "5px");
    			set_style(iframe, "min-width", "20rem");
    			set_style(iframe, "margin-top", "10px");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.google.com/maps/embed/v1/place?key=" + /*googleAPIcredentials*/ ctx[1] + "&q=" + /*locationCode*/ ctx[0])) attr_dev(iframe, "src", iframe_src_value);
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$1, 6, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*locationCode*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://www.google.com/maps/embed/v1/place?key=" + /*googleAPIcredentials*/ ctx[1] + "&q=" + /*locationCode*/ ctx[0])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GoogleMapsLocation', slots, []);
    	let googleAPIcredentials = "AIzaSyDQwc1C5C57PrNUiNCUnDT-1wleMtbA40Y";
    	let { locationCode } = $$props;
    	const writable_props = ['locationCode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GoogleMapsLocation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('locationCode' in $$props) $$invalidate(0, locationCode = $$props.locationCode);
    	};

    	$$self.$capture_state = () => ({ googleAPIcredentials, locationCode });

    	$$self.$inject_state = $$props => {
    		if ('googleAPIcredentials' in $$props) $$invalidate(1, googleAPIcredentials = $$props.googleAPIcredentials);
    		if ('locationCode' in $$props) $$invalidate(0, locationCode = $$props.locationCode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [locationCode, googleAPIcredentials];
    }

    class GoogleMapsLocation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { locationCode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoogleMapsLocation",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*locationCode*/ ctx[0] === undefined && !('locationCode' in props)) {
    			console.warn("<GoogleMapsLocation> was created without expected prop 'locationCode'");
    		}
    	}

    	get locationCode() {
    		throw new Error("<GoogleMapsLocation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locationCode(value) {
    		throw new Error("<GoogleMapsLocation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let h20;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let h21;
    	let t7;
    	let div0;
    	let t8;
    	let div1;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let t9;
    	let div16;
    	let div3;
    	let p1;
    	let t11;
    	let datecountdown;
    	let t12;
    	let div4;
    	let h22;
    	let t14;
    	let p2;
    	let t16;
    	let p3;
    	let t18;
    	let div7;
    	let h23;
    	let t20;
    	let div6;
    	let button0;
    	let span0;
    	let t22;
    	let p4;
    	let t24;
    	let p5;
    	let t26;
    	let p6;
    	let t28;
    	let p7;
    	let t29;
    	let br0;
    	let t30;
    	let t31;
    	let button1;
    	let span1;
    	let t33;
    	let p8;
    	let t35;
    	let p9;
    	let t37;
    	let p10;
    	let t39;
    	let p11;
    	let t40;
    	let br1;
    	let t41;
    	let t42;
    	let div5;
    	let mapslocation;
    	let t43;
    	let div15;
    	let h24;
    	let t45;
    	let div14;
    	let div10;
    	let div8;
    	let t46;
    	let div9;
    	let span2;
    	let t48;
    	let button2;
    	let img0;
    	let img0_src_value;
    	let t49;
    	let div13;
    	let div11;
    	let t50;
    	let div12;
    	let span3;
    	let t52;
    	let button3;
    	let img1;
    	let img1_src_value;
    	let t53;
    	let footer;
    	let div17;
    	let t55;
    	let div22;
    	let div19;
    	let span4;
    	let t57;
    	let div18;
    	let span5;
    	let t59;
    	let span6;
    	let t61;
    	let div21;
    	let span7;
    	let t63;
    	let div20;
    	let span8;
    	let t65;
    	let span9;
    	let current;
    	let mounted;
    	let dispose;
    	datecountdown = new DateCountDown({ $$inline: true });

    	mapslocation = new GoogleMapsLocation({
    			props: {
    				locationCode: /*showFirstLocation*/ ctx[0]
    				? "Igreja+de+Colmeias"
    				: "Quinta+dos+Castanheiros+-+Morgatões"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "We Are Getting Married!";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Marta & Vitor";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Save The Date";
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "September 10th 2022";
    			t7 = space();
    			div0 = element("div");
    			t8 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t9 = space();
    			div16 = element("div");
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Days till wedding";
    			t11 = space();
    			create_component(datecountdown.$$.fragment);
    			t12 = space();
    			div4 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Hello Children!";
    			t14 = space();
    			p2 = element("p");
    			p2.textContent = "Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium\r\n        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;\r\n        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus\r\n        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius\r\n        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera\r\n        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium\r\n        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,\r\n        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus\r\n        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis\r\n        W51, Lactobacillus salivarius W24.";
    			t16 = space();
    			p3 = element("p");
    			p3.textContent = "Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium\r\n        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;\r\n        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus\r\n        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius\r\n        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera\r\n        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium\r\n        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,\r\n        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus\r\n        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis\r\n        W51, Lactobacillus salivarius W24.";
    			t18 = space();
    			div7 = element("div");
    			h23 = element("h2");
    			h23.textContent = "When and Where";
    			t20 = space();
    			div6 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "church";
    			t22 = space();
    			p4 = element("p");
    			p4.textContent = "Church Ceremony";
    			t24 = space();
    			p5 = element("p");
    			p5.textContent = "Igreja de Colmeias";
    			t26 = space();
    			p6 = element("p");
    			p6.textContent = "12:00";
    			t28 = space();
    			p7 = element("p");
    			t29 = text("R. Central nº3411 ");
    			br0 = element("br");
    			t30 = text(" 2420-205 Leiria, Portugal");
    			t31 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "celebration";
    			t33 = space();
    			p8 = element("p");
    			p8.textContent = "Celebration Salon";
    			t35 = space();
    			p9 = element("p");
    			p9.textContent = "Quinta dos Castanheiros, Morgatoes";
    			t37 = space();
    			p10 = element("p");
    			p10.textContent = "14:00";
    			t39 = space();
    			p11 = element("p");
    			t40 = text("Estrada Nacional 1/IC2, Km 129 ");
    			br1 = element("br");
    			t41 = text(" 2410-656 Boa Vista, Leiria");
    			t42 = space();
    			div5 = element("div");
    			create_component(mapslocation.$$.fragment);
    			t43 = space();
    			div15 = element("div");
    			h24 = element("h2");
    			h24.textContent = "If you need a place to stay";
    			t45 = space();
    			div14 = element("div");
    			div10 = element("div");
    			div8 = element("div");
    			t46 = space();
    			div9 = element("div");
    			span2 = element("span");
    			span2.textContent = "Search for some accomodation on Booking.com";
    			t48 = space();
    			button2 = element("button");
    			img0 = element("img");
    			t49 = space();
    			div13 = element("div");
    			div11 = element("div");
    			t50 = space();
    			div12 = element("div");
    			span3 = element("span");
    			span3.textContent = "Search for some accomodation on Air BnB";
    			t52 = space();
    			button3 = element("button");
    			img1 = element("img");
    			t53 = space();
    			footer = element("footer");
    			div17 = element("div");
    			div17.textContent = "Our Contacts:";
    			t55 = space();
    			div22 = element("div");
    			div19 = element("div");
    			span4 = element("span");
    			span4.textContent = "Vitor";
    			t57 = space();
    			div18 = element("div");
    			span5 = element("span");
    			span5.textContent = "phone: 12121212";
    			t59 = space();
    			span6 = element("span");
    			span6.textContent = "email: aaaaa@aa.com";
    			t61 = space();
    			div21 = element("div");
    			span7 = element("span");
    			span7.textContent = "Marta";
    			t63 = space();
    			div20 = element("div");
    			span8 = element("span");
    			span8.textContent = "phone: 12121212";
    			t65 = space();
    			span9 = element("span");
    			span9.textContent = "email: aaaaa@aa.com";
    			attr_dev(h20, "class", "svelte-1ifr2i2");
    			add_location(h20, file, 15, 4, 490);
    			attr_dev(h1, "class", "svelte-1ifr2i2");
    			add_location(h1, file, 16, 4, 528);
    			attr_dev(p0, "class", "svelte-1ifr2i2");
    			add_location(p0, file, 17, 4, 556);
    			attr_dev(h21, "class", "svelte-1ifr2i2");
    			add_location(h21, file, 18, 4, 582);
    			attr_dev(div0, "class", "graph-overlay svelte-1ifr2i2");
    			add_location(div0, file, 19, 4, 616);
    			attr_dev(path0, "class", "elementor-shape-fill svelte-1ifr2i2");
    			attr_dev(path0, "opacity", "0.33");
    			attr_dev(path0, "d", "M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z");
    			add_location(path0, file, 26, 8, 839);
    			attr_dev(path1, "class", "elementor-shape-fill svelte-1ifr2i2");
    			attr_dev(path1, "opacity", "0.66");
    			attr_dev(path1, "d", "M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z");
    			add_location(path1, file, 31, 8, 1124);
    			attr_dev(path2, "class", "elementor-shape-fill svelte-1ifr2i2");
    			attr_dev(path2, "d", "M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z");
    			add_location(path2, file, 36, 8, 1415);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1000 100");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			add_location(svg, file, 21, 6, 704);
    			attr_dev(div1, "class", "elementor-shape graph-container svelte-1ifr2i2");
    			add_location(div1, file, 20, 4, 651);
    			attr_dev(div2, "class", "welcome-banner svelte-1ifr2i2");
    			add_location(div2, file, 14, 2, 456);
    			add_location(p1, file, 45, 6, 1718);
    			add_location(div3, file, 44, 4, 1705);
    			attr_dev(h22, "class", "svelte-1ifr2i2");
    			add_location(h22, file, 49, 6, 1819);
    			add_location(p2, file, 50, 6, 1851);
    			add_location(p3, file, 62, 6, 2600);
    			attr_dev(div4, "class", "introduction svelte-1ifr2i2");
    			add_location(div4, file, 48, 4, 1785);
    			set_style(h23, "margin-bottom", "2rem");
    			add_location(h23, file, 77, 6, 3405);
    			attr_dev(span0, "class", "material-icons svelte-1ifr2i2");
    			set_style(span0, "font-size", "3rem");
    			set_style(span0, "padding", "1rem");
    			add_location(span0, file, 84, 10, 3646);
    			attr_dev(p4, "class", "svelte-1ifr2i2");
    			add_location(p4, file, 87, 10, 3766);
    			attr_dev(p5, "class", "svelte-1ifr2i2");
    			add_location(p5, file, 88, 10, 3800);
    			attr_dev(p6, "class", "svelte-1ifr2i2");
    			add_location(p6, file, 89, 10, 3837);
    			add_location(br0, file, 90, 31, 3882);
    			attr_dev(p7, "class", "svelte-1ifr2i2");
    			add_location(p7, file, 90, 10, 3861);
    			attr_dev(button0, "class", "location-button svelte-1ifr2i2");
    			toggle_class(button0, "selected", /*showFirstLocation*/ ctx[0]);
    			add_location(button0, file, 79, 8, 3480);
    			attr_dev(span1, "class", "material-icons svelte-1ifr2i2");
    			set_style(span1, "font-size", "3rem");
    			set_style(span1, "padding", "1rem");
    			add_location(span1, file, 97, 10, 4115);
    			attr_dev(p8, "class", "svelte-1ifr2i2");
    			add_location(p8, file, 100, 10, 4240);
    			attr_dev(p9, "class", "svelte-1ifr2i2");
    			add_location(p9, file, 101, 10, 4276);
    			attr_dev(p10, "class", "svelte-1ifr2i2");
    			add_location(p10, file, 102, 10, 4329);
    			add_location(br1, file, 104, 43, 4401);
    			attr_dev(p11, "class", "svelte-1ifr2i2");
    			add_location(p11, file, 103, 10, 4353);
    			attr_dev(button1, "class", "location-button svelte-1ifr2i2");
    			toggle_class(button1, "selected", !/*showFirstLocation*/ ctx[0]);
    			add_location(button1, file, 92, 8, 3947);
    			add_location(div5, file, 107, 8, 4479);
    			add_location(div6, file, 78, 6, 3465);
    			add_location(div7, file, 76, 4, 3392);
    			add_location(h24, file, 117, 6, 4749);
    			attr_dev(div8, "class", "stay-button-img booking svelte-1ifr2i2");
    			add_location(div8, file, 120, 10, 4876);
    			attr_dev(span2, "class", "svelte-1ifr2i2");
    			add_location(span2, file, 122, 12, 4974);
    			if (!src_url_equal(img0.src, img0_src_value = "../assets/booking-icon.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "booking logo");
    			attr_dev(img0, "class", "svelte-1ifr2i2");
    			add_location(img0, file, 127, 14, 5175);
    			attr_dev(button2, "class", "booking svelte-1ifr2i2");
    			add_location(button2, file, 123, 12, 5046);
    			attr_dev(div9, "class", "stay-button-content svelte-1ifr2i2");
    			add_location(div9, file, 121, 10, 4927);
    			attr_dev(div10, "class", "stay-button svelte-1ifr2i2");
    			add_location(div10, file, 119, 8, 4839);
    			attr_dev(div11, "class", "stay-button-img airbnb svelte-1ifr2i2");
    			add_location(div11, file, 133, 10, 5347);
    			attr_dev(span3, "class", "svelte-1ifr2i2");
    			add_location(span3, file, 135, 12, 5444);
    			if (!src_url_equal(img1.src, img1_src_value = "../assets/airbnb-icon.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "airbnb logo");
    			attr_dev(img1, "class", "svelte-1ifr2i2");
    			add_location(img1, file, 137, 14, 5595);
    			attr_dev(button3, "class", "airbnb svelte-1ifr2i2");
    			add_location(button3, file, 136, 12, 5512);
    			attr_dev(div12, "class", "stay-button-content svelte-1ifr2i2");
    			add_location(div12, file, 134, 10, 5397);
    			attr_dev(div13, "class", "stay-button airbnb svelte-1ifr2i2");
    			add_location(div13, file, 132, 8, 5303);
    			attr_dev(div14, "class", "stay-buttons-container svelte-1ifr2i2");
    			add_location(div14, file, 118, 6, 4793);
    			set_style(div15, "margin-top", "5rem");
    			add_location(div15, file, 116, 4, 4710);
    			add_location(div16, file, 43, 2, 1694);
    			add_location(div17, file, 145, 4, 5763);
    			add_location(span4, file, 148, 8, 5871);
    			add_location(span5, file, 150, 10, 5940);
    			add_location(span6, file, 151, 10, 5980);
    			attr_dev(div18, "class", "contact-content svelte-1ifr2i2");
    			add_location(div18, file, 149, 8, 5899);
    			attr_dev(div19, "class", "contact-column svelte-1ifr2i2");
    			add_location(div19, file, 147, 6, 5833);
    			add_location(span7, file, 155, 8, 6088);
    			add_location(span8, file, 157, 10, 6157);
    			add_location(span9, file, 158, 10, 6197);
    			attr_dev(div20, "class", "contact-content svelte-1ifr2i2");
    			add_location(div20, file, 156, 8, 6116);
    			attr_dev(div21, "class", "contact-column svelte-1ifr2i2");
    			add_location(div21, file, 154, 6, 6050);
    			attr_dev(div22, "class", "contacts-container svelte-1ifr2i2");
    			add_location(div22, file, 146, 4, 5793);
    			attr_dev(footer, "class", "svelte-1ifr2i2");
    			add_location(footer, file, 144, 2, 5749);
    			attr_dev(main, "class", "svelte-1ifr2i2");
    			add_location(main, file, 13, 0, 446);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t1);
    			append_dev(div2, h1);
    			append_dev(div2, t3);
    			append_dev(div2, p0);
    			append_dev(div2, t5);
    			append_dev(div2, h21);
    			append_dev(div2, t7);
    			append_dev(div2, div0);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(main, t9);
    			append_dev(main, div16);
    			append_dev(div16, div3);
    			append_dev(div3, p1);
    			append_dev(div3, t11);
    			mount_component(datecountdown, div3, null);
    			append_dev(div16, t12);
    			append_dev(div16, div4);
    			append_dev(div4, h22);
    			append_dev(div4, t14);
    			append_dev(div4, p2);
    			append_dev(div4, t16);
    			append_dev(div4, p3);
    			append_dev(div16, t18);
    			append_dev(div16, div7);
    			append_dev(div7, h23);
    			append_dev(div7, t20);
    			append_dev(div7, div6);
    			append_dev(div6, button0);
    			append_dev(button0, span0);
    			append_dev(button0, t22);
    			append_dev(button0, p4);
    			append_dev(button0, t24);
    			append_dev(button0, p5);
    			append_dev(button0, t26);
    			append_dev(button0, p6);
    			append_dev(button0, t28);
    			append_dev(button0, p7);
    			append_dev(p7, t29);
    			append_dev(p7, br0);
    			append_dev(p7, t30);
    			append_dev(div6, t31);
    			append_dev(div6, button1);
    			append_dev(button1, span1);
    			append_dev(button1, t33);
    			append_dev(button1, p8);
    			append_dev(button1, t35);
    			append_dev(button1, p9);
    			append_dev(button1, t37);
    			append_dev(button1, p10);
    			append_dev(button1, t39);
    			append_dev(button1, p11);
    			append_dev(p11, t40);
    			append_dev(p11, br1);
    			append_dev(p11, t41);
    			append_dev(div6, t42);
    			append_dev(div6, div5);
    			mount_component(mapslocation, div5, null);
    			append_dev(div16, t43);
    			append_dev(div16, div15);
    			append_dev(div15, h24);
    			append_dev(div15, t45);
    			append_dev(div15, div14);
    			append_dev(div14, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t46);
    			append_dev(div10, div9);
    			append_dev(div9, span2);
    			append_dev(div9, t48);
    			append_dev(div9, button2);
    			append_dev(button2, img0);
    			append_dev(div14, t49);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div13, t50);
    			append_dev(div13, div12);
    			append_dev(div12, span3);
    			append_dev(div12, t52);
    			append_dev(div12, button3);
    			append_dev(button3, img1);
    			append_dev(main, t53);
    			append_dev(main, footer);
    			append_dev(footer, div17);
    			append_dev(footer, t55);
    			append_dev(footer, div22);
    			append_dev(div22, div19);
    			append_dev(div19, span4);
    			append_dev(div19, t57);
    			append_dev(div19, div18);
    			append_dev(div18, span5);
    			append_dev(div18, t59);
    			append_dev(div18, span6);
    			append_dev(div22, t61);
    			append_dev(div22, div21);
    			append_dev(div21, span7);
    			append_dev(div21, t63);
    			append_dev(div21, div20);
    			append_dev(div20, span8);
    			append_dev(div20, t65);
    			append_dev(div20, span9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*showFirstLocation*/ 1) {
    				toggle_class(button0, "selected", /*showFirstLocation*/ ctx[0]);
    			}

    			if (dirty & /*showFirstLocation*/ 1) {
    				toggle_class(button1, "selected", !/*showFirstLocation*/ ctx[0]);
    			}

    			const mapslocation_changes = {};

    			if (dirty & /*showFirstLocation*/ 1) mapslocation_changes.locationCode = /*showFirstLocation*/ ctx[0]
    			? "Igreja+de+Colmeias"
    			: "Quinta+dos+Castanheiros+-+Morgatões";

    			mapslocation.$set(mapslocation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datecountdown.$$.fragment, local);
    			transition_in(mapslocation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datecountdown.$$.fragment, local);
    			transition_out(mapslocation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(datecountdown);
    			destroy_component(mapslocation);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function navigateToLink(url) {
    	window.open(url, "_blank");
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let showFirstLocation = true;
    	let bookingLink = "https://bit.ly/3pVJMKk";
    	let airbnbLink = "https://www.airbnb.com/s/Leiria--Portugal/homes";

    	function onSwitchLocationShowing(showLocation) {
    		$$invalidate(0, showFirstLocation = showLocation);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, showFirstLocation = true);
    	const click_handler_1 = () => $$invalidate(0, showFirstLocation = false);
    	const click_handler_2 = () => navigateToLink(bookingLink);
    	const click_handler_3 = () => navigateToLink(airbnbLink);

    	$$self.$capture_state = () => ({
    		DateCountDown,
    		MapsLocation: GoogleMapsLocation,
    		showFirstLocation,
    		bookingLink,
    		airbnbLink,
    		onSwitchLocationShowing,
    		navigateToLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('showFirstLocation' in $$props) $$invalidate(0, showFirstLocation = $$props.showFirstLocation);
    		if ('bookingLink' in $$props) $$invalidate(1, bookingLink = $$props.bookingLink);
    		if ('airbnbLink' in $$props) $$invalidate(2, airbnbLink = $$props.airbnbLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showFirstLocation,
    		bookingLink,
    		airbnbLink,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

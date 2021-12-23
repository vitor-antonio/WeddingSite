
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
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
    const file$3 = "src\\DateCountDown.svelte";

    function create_fragment$3(ctx) {
    	let div4;
    	let div0;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t3;
    	let div1;
    	let span2;
    	let t4;
    	let t5;
    	let span3;
    	let t7;
    	let div2;
    	let span4;
    	let t8;
    	let t9;
    	let span5;
    	let t11;
    	let div3;
    	let span6;
    	let t12;
    	let t13;
    	let span7;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(/*days*/ ctx[0]);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Days";
    			t3 = space();
    			div1 = element("div");
    			span2 = element("span");
    			t4 = text(/*hours*/ ctx[1]);
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "Hours";
    			t7 = space();
    			div2 = element("div");
    			span4 = element("span");
    			t8 = text(/*minutes*/ ctx[2]);
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "Minutes";
    			t11 = space();
    			div3 = element("div");
    			span6 = element("span");
    			t12 = text(/*seconds*/ ctx[3]);
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "Seconds";
    			add_location(span0, file$3, 31, 4, 822);
    			add_location(span1, file$3, 32, 4, 847);
    			attr_dev(div0, "class", "time-unit svelte-15kjo7w");
    			add_location(div0, file$3, 30, 2, 793);
    			add_location(span2, file$3, 35, 4, 907);
    			add_location(span3, file$3, 36, 4, 933);
    			attr_dev(div1, "class", "time-unit svelte-15kjo7w");
    			add_location(div1, file$3, 34, 2, 878);
    			add_location(span4, file$3, 39, 4, 994);
    			add_location(span5, file$3, 40, 4, 1022);
    			attr_dev(div2, "class", "time-unit svelte-15kjo7w");
    			add_location(div2, file$3, 38, 2, 965);
    			add_location(span6, file$3, 43, 4, 1085);
    			add_location(span7, file$3, 44, 4, 1113);
    			attr_dev(div3, "class", "time-unit svelte-15kjo7w");
    			add_location(div3, file$3, 42, 2, 1056);
    			attr_dev(div4, "class", "countdown-timer svelte-15kjo7w");
    			add_location(div4, file$3, 29, 0, 760);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, span2);
    			append_dev(span2, t4);
    			append_dev(div1, t5);
    			append_dev(div1, span3);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, span4);
    			append_dev(span4, t8);
    			append_dev(div2, t9);
    			append_dev(div2, span5);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, span6);
    			append_dev(span6, t12);
    			append_dev(div3, t13);
    			append_dev(div3, span7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*days*/ 1) set_data_dev(t0, /*days*/ ctx[0]);
    			if (dirty & /*hours*/ 2) set_data_dev(t4, /*hours*/ ctx[1]);
    			if (dirty & /*minutes*/ 4) set_data_dev(t8, /*minutes*/ ctx[2]);
    			if (dirty & /*seconds*/ 8) set_data_dev(t12, /*seconds*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateCountDown', slots, []);
    	let weddingDate = new Date("09 / 10 / 2022 12:00").getTime();
    	let days = 0;
    	let hours = 0;
    	let minutes = 0;
    	let seconds = 0;

    	function updateTimer() {
    		var nowTime = new Date().getTime();
    		var distance = weddingDate - nowTime;
    		$$invalidate(0, days = Math.floor(distance / (1000 * 60 * 60 * 24)));
    		$$invalidate(1, hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
    		$$invalidate(2, minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)));
    		$$invalidate(3, seconds = Math.floor(distance % (1000 * 60) / 1000));
    	}

    	onMount(() => {
    		const interval = setInterval(
    			() => {
    				updateTimer();
    			},
    			1000
    		);

    		return () => {
    			clearInterval(interval);
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateCountDown> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		weddingDate,
    		days,
    		hours,
    		minutes,
    		seconds,
    		updateTimer
    	});

    	$$self.$inject_state = $$props => {
    		if ('weddingDate' in $$props) weddingDate = $$props.weddingDate;
    		if ('days' in $$props) $$invalidate(0, days = $$props.days);
    		if ('hours' in $$props) $$invalidate(1, hours = $$props.hours);
    		if ('minutes' in $$props) $$invalidate(2, minutes = $$props.minutes);
    		if ('seconds' in $$props) $$invalidate(3, seconds = $$props.seconds);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [days, hours, minutes, seconds];
    }

    class DateCountDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateCountDown",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\GoogleMapsLocation.svelte generated by Svelte v3.44.2 */

    const file$2 = "src\\GoogleMapsLocation.svelte";

    function create_fragment$2(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "Maps Location");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "460px");
    			attr_dev(iframe, "frameborder", "0");
    			set_style(iframe, "border-radius", "5px");
    			set_style(iframe, "margin-top", "10px");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.google.com/maps/embed/v1/place?key=" + /*googleAPIcredentials*/ ctx[1] + "&q=" + /*locationCode*/ ctx[0])) attr_dev(iframe, "src", iframe_src_value);
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$2, 6, 0, 152);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { locationCode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoogleMapsLocation",
    			options,
    			id: create_fragment$2.name
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

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\ExpandablePanel.svelte generated by Svelte v3.44.2 */
    const file$1 = "src\\ExpandablePanel.svelte";

    // (35:2) {#if active}
    function create_if_block$1(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content svelte-d5hjnv");
    			add_location(div, file$1, 35, 4, 803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(35:2) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let button;
    	let div0;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let i;
    	let svg;
    	let path;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*active*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(/*iconName*/ ctx[2]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*name*/ ctx[1]);
    			t3 = space();
    			i = element("i");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t4 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "material-icons svelte-d5hjnv");
    			set_style(span0, "font-size", "2rem");
    			add_location(span0, file$1, 17, 6, 357);
    			attr_dev(span1, "class", "svelte-d5hjnv");
    			add_location(span1, file$1, 20, 6, 454);
    			attr_dev(path, "d", "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z");
    			add_location(path, file$1, 28, 10, 669);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			add_location(svg, file$1, 22, 8, 520);
    			attr_dev(i, "class", "icon svelte-d5hjnv");
    			toggle_class(i, "active", /*active*/ ctx[3]);
    			add_location(i, file$1, 21, 6, 481);
    			attr_dev(div0, "class", "panel-button svelte-d5hjnv");
    			add_location(div0, file$1, 16, 4, 323);
    			attr_dev(button, "class", "header svelte-d5hjnv");
    			add_location(button, file$1, 10, 2, 211);
    			attr_dev(div1, "class", "panel svelte-d5hjnv");
    			add_location(div1, file$1, 9, 0, 188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, i);
    			append_dev(i, svg);
    			append_dev(svg, path);
    			append_dev(div1, t4);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*iconName*/ 4) set_data_dev(t0, /*iconName*/ ctx[2]);
    			if (!current || dirty & /*name*/ 2) set_data_dev(t2, /*name*/ ctx[1]);

    			if (dirty & /*active*/ 8) {
    				toggle_class(i, "active", /*active*/ ctx[3]);
    			}

    			if (/*active*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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
    	let active;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpandablePanel', slots, ['default']);
    	let { name = "" } = $$props;
    	let { iconName = "" } = $$props;
    	let { group = "Item 1" } = $$props;
    	const writable_props = ['name', 'iconName', 'group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExpandablePanel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, group = group === name ? "" : name);
    	};

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('iconName' in $$props) $$invalidate(2, iconName = $$props.iconName);
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ slide, name, iconName, group, active });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('iconName' in $$props) $$invalidate(2, iconName = $$props.iconName);
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*group, name*/ 3) {
    			$$invalidate(3, active = group === name);
    		}
    	};

    	return [group, name, iconName, active, $$scope, slots, click_handler];
    }

    class ExpandablePanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 1, iconName: 2, group: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpandablePanel",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get name() {
    		throw new Error("<ExpandablePanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ExpandablePanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<ExpandablePanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<ExpandablePanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<ExpandablePanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<ExpandablePanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */

    const { window: window_1 } = globals;
    const file = "src\\App.svelte";

    // (126:6) {:else}
    function create_else_block(ctx) {
    	let div0;
    	let expandablepanel0;
    	let t;
    	let div1;
    	let expandablepanel1;
    	let current;

    	expandablepanel0 = new ExpandablePanel({
    			props: {
    				name: "Church Ceremony",
    				iconName: "church",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	expandablepanel1 = new ExpandablePanel({
    			props: {
    				name: "Celebration Salon",
    				iconName: "celebration",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(expandablepanel0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(expandablepanel1.$$.fragment);
    			attr_dev(div0, "class", "expandable-panel svelte-4sn4yj");
    			add_location(div0, file, 126, 8, 5108);
    			attr_dev(div1, "class", "expandable-panel svelte-4sn4yj");
    			add_location(div1, file, 138, 8, 5586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(expandablepanel0, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(expandablepanel1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const expandablepanel0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				expandablepanel0_changes.$$scope = { dirty, ctx };
    			}

    			expandablepanel0.$set(expandablepanel0_changes);
    			const expandablepanel1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				expandablepanel1_changes.$$scope = { dirty, ctx };
    			}

    			expandablepanel1.$set(expandablepanel1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expandablepanel0.$$.fragment, local);
    			transition_in(expandablepanel1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expandablepanel0.$$.fragment, local);
    			transition_out(expandablepanel1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(expandablepanel0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(expandablepanel1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(126:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#if !isMobile}
    function create_if_block(ctx) {
    	let div1;
    	let button0;
    	let span0;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t8;
    	let br0;
    	let t9;
    	let t10;
    	let button1;
    	let span1;
    	let t12;
    	let p4;
    	let t14;
    	let p5;
    	let t16;
    	let p6;
    	let t18;
    	let p7;
    	let t19;
    	let br1;
    	let t20;
    	let t21;
    	let div0;
    	let mapslocation;
    	let current;
    	let mounted;
    	let dispose;

    	mapslocation = new GoogleMapsLocation({
    			props: {
    				locationCode: /*showFirstLocation*/ ctx[1]
    				? "Igreja+de+Colmeias"
    				: "Quinta+dos+Castanheiros+-+Morgatões"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "church";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Church Ceremony";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Igreja de Colmeias";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "12:00";
    			t7 = space();
    			p3 = element("p");
    			t8 = text("R. Central nº3411 ");
    			br0 = element("br");
    			t9 = text(" 2420-205 Leiria, Portugal");
    			t10 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "celebration";
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "Celebration Salon";
    			t14 = space();
    			p5 = element("p");
    			p5.textContent = "Quinta dos Castanheiros, Morgatoes";
    			t16 = space();
    			p6 = element("p");
    			p6.textContent = "14:00";
    			t18 = space();
    			p7 = element("p");
    			t19 = text("Estrada Nacional 1/IC2, Km 129 ");
    			br1 = element("br");
    			t20 = text(" 2410-656 Boa Vista, Leiria");
    			t21 = space();
    			div0 = element("div");
    			create_component(mapslocation.$$.fragment);
    			attr_dev(span0, "class", "material-icons svelte-4sn4yj");
    			set_style(span0, "font-size", "3rem");
    			set_style(span0, "padding", "1rem");
    			add_location(span0, file, 88, 12, 3889);
    			attr_dev(p0, "class", "svelte-4sn4yj");
    			add_location(p0, file, 94, 12, 4059);
    			attr_dev(p1, "class", "svelte-4sn4yj");
    			add_location(p1, file, 95, 12, 4095);
    			attr_dev(p2, "class", "svelte-4sn4yj");
    			add_location(p2, file, 96, 12, 4134);
    			add_location(br0, file, 97, 33, 4181);
    			attr_dev(p3, "class", "svelte-4sn4yj");
    			add_location(p3, file, 97, 12, 4160);
    			attr_dev(button0, "class", "location-button svelte-4sn4yj");
    			toggle_class(button0, "selected", /*showFirstLocation*/ ctx[1]);
    			add_location(button0, file, 83, 10, 3713);
    			attr_dev(span1, "class", "material-icons svelte-4sn4yj");
    			set_style(span1, "font-size", "3rem");
    			set_style(span1, "padding", "1rem");
    			add_location(span1, file, 104, 12, 4428);
    			attr_dev(p4, "class", "svelte-4sn4yj");
    			add_location(p4, file, 110, 12, 4603);
    			attr_dev(p5, "class", "svelte-4sn4yj");
    			add_location(p5, file, 111, 12, 4641);
    			attr_dev(p6, "class", "svelte-4sn4yj");
    			add_location(p6, file, 112, 12, 4696);
    			add_location(br1, file, 114, 45, 4772);
    			attr_dev(p7, "class", "svelte-4sn4yj");
    			add_location(p7, file, 113, 12, 4722);
    			attr_dev(button1, "class", "location-button svelte-4sn4yj");
    			toggle_class(button1, "selected", !/*showFirstLocation*/ ctx[1]);
    			add_location(button1, file, 99, 10, 4250);
    			add_location(div0, file, 117, 10, 4856);
    			add_location(div1, file, 82, 8, 3696);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(button0, span0);
    			append_dev(button0, t1);
    			append_dev(button0, p0);
    			append_dev(button0, t3);
    			append_dev(button0, p1);
    			append_dev(button0, t5);
    			append_dev(button0, p2);
    			append_dev(button0, t7);
    			append_dev(button0, p3);
    			append_dev(p3, t8);
    			append_dev(p3, br0);
    			append_dev(p3, t9);
    			append_dev(div1, t10);
    			append_dev(div1, button1);
    			append_dev(button1, span1);
    			append_dev(button1, t12);
    			append_dev(button1, p4);
    			append_dev(button1, t14);
    			append_dev(button1, p5);
    			append_dev(button1, t16);
    			append_dev(button1, p6);
    			append_dev(button1, t18);
    			append_dev(button1, p7);
    			append_dev(p7, t19);
    			append_dev(p7, br1);
    			append_dev(p7, t20);
    			append_dev(div1, t21);
    			append_dev(div1, div0);
    			mount_component(mapslocation, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*showFirstLocation*/ 2) {
    				toggle_class(button0, "selected", /*showFirstLocation*/ ctx[1]);
    			}

    			if (dirty & /*showFirstLocation*/ 2) {
    				toggle_class(button1, "selected", !/*showFirstLocation*/ ctx[1]);
    			}

    			const mapslocation_changes = {};

    			if (dirty & /*showFirstLocation*/ 2) mapslocation_changes.locationCode = /*showFirstLocation*/ ctx[1]
    			? "Igreja+de+Colmeias"
    			: "Quinta+dos+Castanheiros+-+Morgatões";

    			mapslocation.$set(mapslocation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mapslocation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mapslocation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(mapslocation);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:6) {#if !isMobile}",
    		ctx
    	});

    	return block;
    }

    // (128:10) <ExpandablePanel name={"Church Ceremony"} iconName={"church"}>
    function create_default_slot_1(ctx) {
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t4;
    	let br;
    	let t5;
    	let t6;
    	let div1;
    	let mapslocation;
    	let current;

    	mapslocation = new GoogleMapsLocation({
    			props: { locationCode: "Igreja+de+Colmeias" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Igreja de Colmeias";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "12:00";
    			t3 = space();
    			p2 = element("p");
    			t4 = text("R. Central nº3411 ");
    			br = element("br");
    			t5 = text(" 2420-205 Leiria, Portugal");
    			t6 = space();
    			div1 = element("div");
    			create_component(mapslocation.$$.fragment);
    			attr_dev(p0, "class", "svelte-4sn4yj");
    			add_location(p0, file, 129, 14, 5277);
    			attr_dev(p1, "class", "svelte-4sn4yj");
    			add_location(p1, file, 130, 14, 5318);
    			add_location(br, file, 131, 35, 5367);
    			attr_dev(p2, "class", "svelte-4sn4yj");
    			add_location(p2, file, 131, 14, 5346);
    			attr_dev(div0, "class", "panel-content-details svelte-4sn4yj");
    			add_location(div0, file, 128, 12, 5226);
    			add_location(div1, file, 133, 12, 5437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div0, t3);
    			append_dev(div0, p2);
    			append_dev(p2, t4);
    			append_dev(p2, br);
    			append_dev(p2, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(mapslocation, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mapslocation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mapslocation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div1);
    			destroy_component(mapslocation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(128:10) <ExpandablePanel name={\\\"Church Ceremony\\\"} iconName={\\\"church\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (140:10) <ExpandablePanel name={"Celebration Salon"} iconName={"celebration"}>
    function create_default_slot(ctx) {
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t4;
    	let br;
    	let t5;
    	let t6;
    	let div1;
    	let mapslocation;
    	let current;

    	mapslocation = new GoogleMapsLocation({
    			props: {
    				locationCode: "Quinta+dos+Castanheiros+-+Morgatões"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Quinta dos Castanheiros, Morgatoes";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "14:00";
    			t3 = space();
    			p2 = element("p");
    			t4 = text("Estrada Nacional 1/IC2, Km 129 ");
    			br = element("br");
    			t5 = text(" 2410-656 Boa Vista, Leiria");
    			t6 = space();
    			div1 = element("div");
    			create_component(mapslocation.$$.fragment);
    			attr_dev(p0, "class", "svelte-4sn4yj");
    			add_location(p0, file, 141, 14, 5762);
    			attr_dev(p1, "class", "svelte-4sn4yj");
    			add_location(p1, file, 142, 14, 5819);
    			add_location(br, file, 144, 47, 5899);
    			attr_dev(p2, "class", "svelte-4sn4yj");
    			add_location(p2, file, 143, 14, 5847);
    			attr_dev(div0, "class", "panel-content-details svelte-4sn4yj");
    			add_location(div0, file, 140, 12, 5711);
    			add_location(div1, file, 147, 12, 5986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div0, t3);
    			append_dev(div0, p2);
    			append_dev(p2, t4);
    			append_dev(p2, br);
    			append_dev(p2, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(mapslocation, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mapslocation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mapslocation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div1);
    			destroy_component(mapslocation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(140:10) <ExpandablePanel name={\\\"Celebration Salon\\\"} iconName={\\\"celebration\\\"}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div3;
    	let div0;
    	let h20;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let h21;
    	let t7;
    	let div1;
    	let t8;
    	let div2;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let t9;
    	let div15;
    	let div4;
    	let datecountdown;
    	let t10;
    	let div5;
    	let h22;
    	let t12;
    	let p1;
    	let t14;
    	let p2;
    	let t16;
    	let div6;
    	let h23;
    	let t18;
    	let current_block_type_index;
    	let if_block;
    	let t19;
    	let div14;
    	let h24;
    	let t21;
    	let div13;
    	let div9;
    	let div7;
    	let t22;
    	let div8;
    	let span0;
    	let t24;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t25;
    	let div12;
    	let div10;
    	let t26;
    	let div11;
    	let span1;
    	let t28;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t29;
    	let footer;
    	let h4;
    	let t31;
    	let div20;
    	let div17;
    	let span2;
    	let t33;
    	let div16;
    	let span3;
    	let t35;
    	let span4;
    	let t37;
    	let div19;
    	let span5;
    	let t39;
    	let div18;
    	let span6;
    	let t41;
    	let span7;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[5]);
    	datecountdown = new DateCountDown({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*isMobile*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div0 = element("div");
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
    			div1 = element("div");
    			t8 = space();
    			div2 = element("div");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t9 = space();
    			div15 = element("div");
    			div4 = element("div");
    			create_component(datecountdown.$$.fragment);
    			t10 = space();
    			div5 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Hello Children!";
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium\r\n        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;\r\n        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus\r\n        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius\r\n        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera\r\n        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium\r\n        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,\r\n        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus\r\n        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis\r\n        W51, Lactobacillus salivarius W24.";
    			t14 = space();
    			p2 = element("p");
    			p2.textContent = "Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium\r\n        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;\r\n        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus\r\n        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius\r\n        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera\r\n        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium\r\n        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,\r\n        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus\r\n        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis\r\n        W51, Lactobacillus salivarius W24.";
    			t16 = space();
    			div6 = element("div");
    			h23 = element("h2");
    			h23.textContent = "When and Where";
    			t18 = space();
    			if_block.c();
    			t19 = space();
    			div14 = element("div");
    			h24 = element("h2");
    			h24.textContent = "If you need a place to stay";
    			t21 = space();
    			div13 = element("div");
    			div9 = element("div");
    			div7 = element("div");
    			t22 = space();
    			div8 = element("div");
    			span0 = element("span");
    			span0.textContent = "Search for some accomodation on Booking.com";
    			t24 = space();
    			button0 = element("button");
    			img0 = element("img");
    			t25 = space();
    			div12 = element("div");
    			div10 = element("div");
    			t26 = space();
    			div11 = element("div");
    			span1 = element("span");
    			span1.textContent = "Search for some accomodation on Air BnB";
    			t28 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t29 = space();
    			footer = element("footer");
    			h4 = element("h4");
    			h4.textContent = "You can contact us:";
    			t31 = space();
    			div20 = element("div");
    			div17 = element("div");
    			span2 = element("span");
    			span2.textContent = "Marta";
    			t33 = space();
    			div16 = element("div");
    			span3 = element("span");
    			span3.textContent = "phone: 12121212";
    			t35 = space();
    			span4 = element("span");
    			span4.textContent = "email: aaaaa@aa.com";
    			t37 = space();
    			div19 = element("div");
    			span5 = element("span");
    			span5.textContent = "Vitor";
    			t39 = space();
    			div18 = element("div");
    			span6 = element("span");
    			span6.textContent = "phone: 12121212";
    			t41 = space();
    			span7 = element("span");
    			span7.textContent = "email: aaaaa@aa.com";
    			attr_dev(h20, "class", "svelte-4sn4yj");
    			add_location(h20, file, 17, 6, 594);
    			attr_dev(h1, "class", "svelte-4sn4yj");
    			add_location(h1, file, 18, 6, 634);
    			set_style(p0, "font-size", "18px");
    			set_style(p0, "margin-top", "15px");
    			attr_dev(p0, "class", "svelte-4sn4yj");
    			add_location(p0, file, 19, 6, 664);
    			set_style(h21, "padding-top", "5px");
    			attr_dev(h21, "class", "svelte-4sn4yj");
    			add_location(h21, file, 20, 6, 735);
    			attr_dev(div0, "class", "header-container svelte-4sn4yj");
    			add_location(div0, file, 16, 4, 556);
    			attr_dev(div1, "class", "graph-overlay svelte-4sn4yj");
    			add_location(div1, file, 23, 4, 809);
    			attr_dev(path0, "class", "elementor-shape-fill svelte-4sn4yj");
    			attr_dev(path0, "opacity", "0.33");
    			attr_dev(path0, "d", "M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z");
    			add_location(path0, file, 30, 8, 1052);
    			attr_dev(path1, "class", "elementor-shape-fill svelte-4sn4yj");
    			attr_dev(path1, "opacity", "0.66");
    			attr_dev(path1, "d", "M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z");
    			add_location(path1, file, 35, 8, 1337);
    			attr_dev(path2, "class", "elementor-shape-fill svelte-4sn4yj");
    			attr_dev(path2, "d", "M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z");
    			add_location(path2, file, 40, 8, 1628);
    			attr_dev(svg, "class", "svg-graphic svelte-4sn4yj");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1000 100");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			add_location(svg, file, 25, 6, 897);
    			attr_dev(div2, "class", "elementor-shape graph-container svelte-4sn4yj");
    			add_location(div2, file, 24, 4, 844);
    			attr_dev(div3, "class", "welcome-banner svelte-4sn4yj");
    			add_location(div3, file, 15, 2, 522);
    			add_location(div4, file, 48, 4, 1918);
    			attr_dev(h22, "class", "svelte-4sn4yj");
    			add_location(h22, file, 52, 6, 2000);
    			add_location(p1, file, 53, 6, 2032);
    			add_location(p2, file, 65, 6, 2781);
    			attr_dev(div5, "class", "introduction svelte-4sn4yj");
    			add_location(div5, file, 51, 4, 1966);
    			set_style(h23, "margin-bottom", "2rem");
    			attr_dev(h23, "class", "svelte-4sn4yj");
    			add_location(h23, file, 80, 6, 3611);
    			attr_dev(div6, "class", "location-section svelte-4sn4yj");
    			add_location(div6, file, 79, 4, 3573);
    			attr_dev(h24, "class", "svelte-4sn4yj");
    			add_location(h24, file, 157, 6, 6244);
    			attr_dev(div7, "class", "stay-button-img booking svelte-4sn4yj");
    			add_location(div7, file, 160, 10, 6371);
    			attr_dev(span0, "class", "svelte-4sn4yj");
    			add_location(span0, file, 162, 12, 6469);
    			if (!src_url_equal(img0.src, img0_src_value = "../assets/booking-icon.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "booking logo");
    			attr_dev(img0, "class", "svelte-4sn4yj");
    			add_location(img0, file, 167, 14, 6670);
    			attr_dev(button0, "class", "booking svelte-4sn4yj");
    			add_location(button0, file, 163, 12, 6541);
    			attr_dev(div8, "class", "stay-button-content svelte-4sn4yj");
    			add_location(div8, file, 161, 10, 6422);
    			attr_dev(div9, "class", "stay-button svelte-4sn4yj");
    			add_location(div9, file, 159, 8, 6334);
    			attr_dev(div10, "class", "stay-button-img airbnb svelte-4sn4yj");
    			add_location(div10, file, 173, 10, 6842);
    			attr_dev(span1, "class", "svelte-4sn4yj");
    			add_location(span1, file, 175, 12, 6939);
    			if (!src_url_equal(img1.src, img1_src_value = "../assets/airbnb-icon.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "airbnb logo");
    			attr_dev(img1, "class", "svelte-4sn4yj");
    			add_location(img1, file, 177, 14, 7090);
    			attr_dev(button1, "class", "airbnb svelte-4sn4yj");
    			add_location(button1, file, 176, 12, 7007);
    			attr_dev(div11, "class", "stay-button-content svelte-4sn4yj");
    			add_location(div11, file, 174, 10, 6892);
    			attr_dev(div12, "class", "stay-button airbnb svelte-4sn4yj");
    			add_location(div12, file, 172, 8, 6798);
    			attr_dev(div13, "class", "stay-buttons-container svelte-4sn4yj");
    			add_location(div13, file, 158, 6, 6288);
    			set_style(div14, "margin-top", "5rem");
    			add_location(div14, file, 156, 4, 6205);
    			add_location(div15, file, 47, 2, 1907);
    			add_location(h4, file, 185, 4, 7258);
    			add_location(span2, file, 189, 8, 7409);
    			add_location(span3, file, 191, 10, 7478);
    			add_location(span4, file, 192, 10, 7518);
    			attr_dev(div16, "class", "contact-content svelte-4sn4yj");
    			add_location(div16, file, 190, 8, 7437);
    			attr_dev(div17, "class", "contact-column svelte-4sn4yj");
    			add_location(div17, file, 188, 6, 7371);
    			add_location(span5, file, 196, 8, 7626);
    			add_location(span6, file, 198, 10, 7695);
    			add_location(span7, file, 199, 10, 7735);
    			attr_dev(div18, "class", "contact-content svelte-4sn4yj");
    			add_location(div18, file, 197, 8, 7654);
    			attr_dev(div19, "class", "contact-column svelte-4sn4yj");
    			add_location(div19, file, 195, 6, 7588);
    			attr_dev(div20, "class", "contacts-container svelte-4sn4yj");
    			add_location(div20, file, 187, 4, 7331);
    			attr_dev(footer, "class", "svelte-4sn4yj");
    			add_location(footer, file, 184, 2, 7244);
    			attr_dev(main, "class", "svelte-4sn4yj");
    			add_location(main, file, 14, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, h21);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(main, t9);
    			append_dev(main, div15);
    			append_dev(div15, div4);
    			mount_component(datecountdown, div4, null);
    			append_dev(div15, t10);
    			append_dev(div15, div5);
    			append_dev(div5, h22);
    			append_dev(div5, t12);
    			append_dev(div5, p1);
    			append_dev(div5, t14);
    			append_dev(div5, p2);
    			append_dev(div15, t16);
    			append_dev(div15, div6);
    			append_dev(div6, h23);
    			append_dev(div6, t18);
    			if_blocks[current_block_type_index].m(div6, null);
    			append_dev(div15, t19);
    			append_dev(div15, div14);
    			append_dev(div14, h24);
    			append_dev(div14, t21);
    			append_dev(div14, div13);
    			append_dev(div13, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t22);
    			append_dev(div9, div8);
    			append_dev(div8, span0);
    			append_dev(div8, t24);
    			append_dev(div8, button0);
    			append_dev(button0, img0);
    			append_dev(div13, t25);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div12, t26);
    			append_dev(div12, div11);
    			append_dev(div11, span1);
    			append_dev(div11, t28);
    			append_dev(div11, button1);
    			append_dev(button1, img1);
    			append_dev(main, t29);
    			append_dev(main, footer);
    			append_dev(footer, h4);
    			append_dev(footer, t31);
    			append_dev(footer, div20);
    			append_dev(div20, div17);
    			append_dev(div17, span2);
    			append_dev(div17, t33);
    			append_dev(div17, div16);
    			append_dev(div16, span3);
    			append_dev(div16, t35);
    			append_dev(div16, span4);
    			append_dev(div20, t37);
    			append_dev(div20, div19);
    			append_dev(div19, span5);
    			append_dev(div19, t39);
    			append_dev(div19, div18);
    			append_dev(div18, span6);
    			append_dev(div18, t41);
    			append_dev(div18, span7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*onwindowresize*/ ctx[5]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div6, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datecountdown.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datecountdown.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(datecountdown);
    			if_blocks[current_block_type_index].d();
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
    	let isMobile;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let showFirstLocation = true;
    	let bookingLink = "https://bit.ly/3pVJMKk";
    	let airbnbLink = "https://www.airbnb.com/s/Leiria--Portugal/homes";
    	let windowWidth;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, windowWidth = window_1.innerWidth);
    	}

    	const click_handler = () => $$invalidate(1, showFirstLocation = true);
    	const click_handler_1 = () => $$invalidate(1, showFirstLocation = false);
    	const click_handler_2 = () => navigateToLink(bookingLink);
    	const click_handler_3 = () => navigateToLink(airbnbLink);

    	$$self.$capture_state = () => ({
    		DateCountDown,
    		MapsLocation: GoogleMapsLocation,
    		ExpandablePanel,
    		showFirstLocation,
    		bookingLink,
    		airbnbLink,
    		windowWidth,
    		navigateToLink,
    		isMobile
    	});

    	$$self.$inject_state = $$props => {
    		if ('showFirstLocation' in $$props) $$invalidate(1, showFirstLocation = $$props.showFirstLocation);
    		if ('bookingLink' in $$props) $$invalidate(3, bookingLink = $$props.bookingLink);
    		if ('airbnbLink' in $$props) $$invalidate(4, airbnbLink = $$props.airbnbLink);
    		if ('windowWidth' in $$props) $$invalidate(0, windowWidth = $$props.windowWidth);
    		if ('isMobile' in $$props) $$invalidate(2, isMobile = $$props.isMobile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*windowWidth*/ 1) {
    			$$invalidate(2, isMobile = windowWidth < 650);
    		}
    	};

    	return [
    		windowWidth,
    		showFirstLocation,
    		isMobile,
    		bookingLink,
    		airbnbLink,
    		onwindowresize,
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

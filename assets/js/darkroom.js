/* =========================================================
   DARKROOM — interactions
   ========================================================= */
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Shutter intro ---- */
    const shutter = $('#shutter');
    document.body.classList.add('loading');
    const openShutter = () => {
        shutter.classList.add('open');
        setTimeout(() => document.body.classList.remove('loading'), 700);
    };
    if (reduced) openShutter();
    else window.addEventListener('load', () => setTimeout(openShutter, 500));
    setTimeout(openShutter, 3000); // safety net

    /* ---- Mobile menu ---- */
    const menu = $('#nav-menu');
    $('#nav-toggle').addEventListener('click', () => menu.classList.toggle('show'));
    $$('.nav__link').forEach(l => l.addEventListener('click', () => menu.classList.remove('show')));

    /* ---- Flash + frame counter on nav clicks / CTA ---- */
    const flash = $('#flash');
    const counter = $('#frame-count');
    let frames = 1;
    const shoot = () => {
        if (!reduced) {
            flash.classList.remove('fire');
            void flash.offsetWidth;
            flash.classList.add('fire');
        }
        frames = frames >= 36 ? 1 : frames + 1;
        counter.textContent = String(frames).padStart(2, '0');
    };
    $$('.nav__link, .btn, .print, .hanging').forEach(el => el.addEventListener('click', shoot));

    /* ---- Active section in nav ---- */
    const links = $$('.nav__link');
    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => sectionObs.observe(s));

    /* ---- Reveal on scroll ("developing") ---- */
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const siblings = $$('.reveal', e.target.parentElement);
                e.target.style.transitionDelay = (siblings.indexOf(e.target) % 4) * 90 + 'ms';
                e.target.classList.add('in');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: .12 });
    $$('.reveal').forEach(el => revealObs.observe(el));

    /* ---- Focus reticle cursor ---- */
    const reticle = $('#reticle');
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
        addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; reticle.classList.add('on'); });
        document.addEventListener('mouseleave', () => reticle.classList.remove('on'));
        const tick = () => {
            rx += (x - rx) * .22; ry += (y - ry) * .22;
            reticle.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(tick);
        };
        tick();
        $$('a, button, .lens').forEach(el => {
            el.addEventListener('mouseenter', () => reticle.classList.add('lock'));
            el.addEventListener('mouseleave', () => reticle.classList.remove('lock'));
        });
    }

    /* ---- Lens spotlight follows mouse ---- */
    $$('.lens').forEach(card => card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
    }));

    /* ---- Aperture readout changes with scroll ---- */
    const stops = ['1.4', '1.8', '2.8', '4', '5.6', '8', '11', '16'];
    const ap = $('#aperture');
    addEventListener('scroll', () => {
        const p = Math.min(scrollY / (document.body.scrollHeight - innerHeight), 1);
        ap.textContent = stops[Math.round(p * (stops.length - 1))];
    }, { passive: true });

    /* ---- Gallery lightbox ---- */
    const projects = [
        { title: 'Clinical Decision Support Agent', meta: 'Agentic AI · RAG · August 2025', img: 'assets/img/work3.jpg',
          link: 'https://github.com/bhumika-1815/clinical-ai-agent',
          points: ['Built a 5-agent AI pipeline and RAG system (LangGraph, ChromaDB, Hugging Face) to analyze large, unstructured clinical datasets and predict 30-day readmission risk, achieving an AUC-ROC of 0.867.',
                   'Shipped the model as a production, interactive Streamlit application for stakeholder use.'] },
        { title: 'Geospatial Analysis of COVID-19 Inequity in New York City', meta: 'Geospatial · Capstone · May 2025', img: 'assets/img/work2.jpg',
          link: 'https://github.com/bhumika-1815/Capstone_Project_2025',
          points: ['Performed spatial and statistical analyses in ArcGIS Pro and Python, integrating NYC case data by ZCTA with U.S. Census demographics including median income and population density.',
                   'Revealed that low-income neighborhoods had 25–30% higher case densities, and presented findings to stakeholders as a capstone deliverable.'] },
        { title: 'Customer Complaint Analysis & Prediction System', meta: 'NLP · 2024', img: 'assets/img/work1.jpg', link: null,
          points: ['Fine-tuned transformer models (DistilBERT, RoBERTa, BERT, T5, BART) using PyTorch and Hugging Face Transformers for complaint classification, summarization, sentiment analysis, and response-quality prediction on consumer complaint data.',
                   'Applied cross-validation, weighted loss functions, and learning-rate scheduling to optimize F1 and ROUGE scores as part of a 4-person NLP research team.'] },
        { title: 'Bridging the Gap: Wages, Housing & U.S. Financial Stability', meta: 'Economics · Tableau · May 2024', img: 'assets/img/Housingimage.jpg',
          link: 'https://github.com/bhumika-1815/Bridging-the-Gap',
          points: ['Conducted a comprehensive analysis of U.S. financial stability, focusing on wage policies, housing affordability, and economic resilience during recessions, utilizing datasets from the Federal Reserve Bank of St. Louis and advanced data visualization techniques in Tableau.'] },
        { title: 'Human Action Recognition using CNNs', meta: 'Computer Vision · May 2024', img: 'assets/img/humanaction.webp',
          link: 'https://github.com/bhumika-1815/Human-Action-Recognition-CNN',
          points: ['Engineered a Convolutional Neural Network (CNN) model using TensorFlow for Human Action Recognition, achieving 66.75% classification accuracy on 12,000 images by applying advanced data preprocessing techniques.'] },
        { title: 'AWS YouTube Video Analytics Pipeline', meta: 'Data Engineering · April 2024', img: 'assets/img/aws.jpg',
          link: 'https://github.com/bhumika-1815/AWS-Youtube-Analytics-Pipeline',
          points: ['Led the design and deployment of an end-to-end data processing and analytics pipeline on AWS, integrating services like S3, Glue, Lambda, Athena, and QuickSight for comprehensive data management, transformation, and visualization.'] },
        { title: 'Wine Quality Prediction', meta: 'Machine Learning · R · December 2023', img: 'assets/img/wine.jpg',
          link: 'https://github.com/bhumika-1815/Wine-Quality-Prediction-Project',
          points: ['Developed an R-based machine learning model to predict red and white wine quality ratings; applied exploratory data analysis (EDA), statistical tests, and advanced modeling techniques.',
                   'Produced a comprehensive report summarizing data insights, modeling approach, results, and recommendations.'] },
    ];

    const lb = $('#lightbox');
    let lastFocus = null;
    const openLb = i => {
        const p = projects[i];
        $('#lb-img').src = p.img;
        $('#lb-img').alt = p.title;
        $('#lb-title').textContent = p.title;
        $('#lb-meta').textContent = `Frame ${String(i + 1).padStart(2, '0')} · ${p.meta}`;
        $('#lb-points').innerHTML = '';
        p.points.forEach(t => { const li = document.createElement('li'); li.textContent = t; $('#lb-points').append(li); });
        const link = $('#lb-link');
        link.hidden = !p.link;
        if (p.link) link.href = p.link;
        lastFocus = document.activeElement;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        $('#lb-close').focus();
    };
    const closeLb = () => {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        lastFocus && lastFocus.focus();
    };
    $$('.print').forEach(b => b.addEventListener('click', () => openLb(+b.dataset.project)));
    $('#lb-close').addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });

    /* ---- Experience playback ---- */
    const thumbs = $$('.pb-thumb'), panels = $$('.pb-panel');
    let cur = 0;
    const show = i => {
        cur = (i + thumbs.length) % thumbs.length;
        thumbs.forEach((t, k) => { t.classList.toggle('active', k === cur); t.setAttribute('aria-selected', k === cur); });
        panels.forEach((p, k) => { p.hidden = k !== cur; p.classList.toggle('active', k === cur); });
        $('#pb-count').textContent = thumbs[cur].querySelector('.pb-thumb__no').textContent;
        $('#pb-bar').style.width = ((cur + 1) / thumbs.length * 100) + '%';
    };
    thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    $('#pb-prev').addEventListener('click', () => show(cur - 1));
    $('#pb-next').addEventListener('click', () => show(cur + 1));
    $('.pb-strip').addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); thumbs[cur].focus(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); thumbs[cur].focus(); }
    });

    $('#year').textContent = new Date().getFullYear();
})();

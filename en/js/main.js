// 移动端导航
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('show');
    });

    // 点击导航链接后关闭菜单
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('show');
        });
    });
}

// 导航栏滚动吸顶效果（已由fixed定位实现）
// 此处可添加滚动时的背景变化效果

// 产品筛选功能
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 筛选产品
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// 新闻详情弹窗
function openNewsDetail(id) {
    const modal = document.getElementById('newsModal');
    const title = document.getElementById('newsDetailTitle');
    const date = document.getElementById('newsDetailDate');
    const body = document.getElementById('newsDetailBody');

    // 模拟新闻数据
    const isEN = document.documentElement.lang === 'en';

    const newsData = isEN ? {
        1: {
            title: 'Core Product Focus: Five Industrial Lines Now in Supply',
            date: '2026-11-16',
            content: '<p>Non-woven fabric, circuit breakers, cast stainless steel parts, HDPE plastic products and lifting machinery are now all available for supply. You can order a single category, or consolidate several categories into one container to spread freight cost.</p><p>Specifications, material certificates and packing lists are available on request for every category.</p>'
        },
        2: {
            title: 'How Your Order Progresses: Four Milestones to Delivery',
            date: '2026-11-16',
            content: '<p>Once the order is confirmed we move through four milestones: preparation, sampling inspection, packing and shipment, and arrival follow-up. Photos and documents are shared at each milestone so you can track progress end to end.</p><p>Trade terms supported: EXW, FOB, CIF and DDP.</p>'
        }
    } : {
        1: {
            title: '主营品类说明：五大工业品线同步供应',
            date: '2026-11-16',
            content: '<p>公司是综合贸易公司，工业品全品类均可承接采购委托；口罩用无纺布、断路器、铸造不锈钢件、HDPE 塑料制品与起重机械是当前重点产品线，已同步开放供应。既可以单品类采购，也可以多品类拼柜发运，摊薄运费与仓储成本。</p><p>各品类均可提供规格表、材质证明与装箱单据，定制类产品可在确认图纸后安排排产。</p>'
        },
        2: {
            title: '交付流程说明：从下单到到货的四个节点',
            date: '2026-11-16',
            content: '<p>订单确认后依次完成备货、抽样验货、装箱发运与到货跟进四个节点，每个节点均同步照片与单据，客户可全程跟踪，不必反复追问进度。</p><p>贸易条款支持 EXW / FOB / CIF / DDP，可按需安排拼柜与分批发运。</p>'
        }
    };

    if (newsData[id]) {
        title.textContent = newsData[id].title;
        date.textContent = newsData[id].date;
        body.innerHTML = newsData[id].content;
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeNewsDetail() {
    const modal = document.getElementById('newsModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 点击弹窗背景关闭
document.getElementById('newsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newsModal') {
        closeNewsDetail();
    }
});

// 构造 mailto 兜底链接（未配置表单服务时使用）
function buildMailtoUrl(data, isEN) {
    const pick = (k) => (data[k] || '').trim();
    // 品类是 key（如 casting），邮件里要显示可读名称
    const CATEGORY_LABELS = {
        'mask-material': isEN ? 'Mask Material Rolls (Non-Woven / Composite / Meltblown)' : '口罩原材料卷材（非织造布 / 复合材料 / 熔喷布）',
        mask: isEN ? 'N95 / FFP3 Finished Masks (medical / civilian)' : 'N95 / FFP3 成品口罩（医用 / 民用）',
        ppe: isEN ? 'Protective Coveralls & Isolation Gowns' : '防护服与隔离衣（PPE 防护服装）',
        'mask-machine': isEN ? 'Mask Making Machinery / Meltblown Lines' : '口罩生产设备（口罩机 / 熔喷生产线）',
        breaker: isEN ? 'Circuit Breakers & Low-Voltage Components' : '断路器与低压电气元件',
        casting: isEN ? 'Castings — Cast Iron / Steel / Stainless / Aluminium' : '铸造件（铁 / 钢 / 不锈钢 / 铝）',
        hdpe: isEN ? 'HDPE Plastic Products' : 'HDPE 塑料制品',
        lifting: isEN ? 'Lifting Machinery & Rigging' : '起重机械与索具',
        custom: isEN ? 'Custom / Multi-category supply' : '定制 / 多品类组合供货',
        other: isEN ? 'Other industrial goods / full-category sourcing' : '其他工业品 / 全品类采购委托'
    };
    const category = (() => {
        const raw = pick('category');
        if (!raw) return '';
        return CATEGORY_LABELS[raw] || raw;
    })();
    const subject = isEN
        ? `Enquiry from ${pick('name') || ''} (${pick('company') || 'N/A'})`
        : `采购询价 - ${pick('name') || ''}（${pick('company') || '未留公司'}）`;
    const body = isEN
        ? `Name: ${pick('name')}\nCompany: ${pick('company')}\nEmail: ${pick('email')}\nPhone/WhatsApp: ${pick('phone')}\nCategory: ${category}\nQuantity: ${pick('quantity')}\nDestination: ${pick('destination')}\n\nRequirement:\n${pick('requirement')}`
        : `姓名：${pick('name')}\n公司：${pick('company')}\n邮箱：${pick('email')}\n电话/WhatsApp：${pick('phone')}\n产品品类：${category}\n采购数量：${pick('quantity')}\n目的国家/地区：${pick('destination')}\n\n采购需求：\n${pick('requirement')}`;
    return `mailto:hellenshi131@sina.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// 询价表单提交
const inquiryForm = document.getElementById('inquiryForm');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isEN = document.documentElement.lang === 'en';
        const getVal = (sel) => {
            const el = inquiryForm.querySelector(sel);
            return el ? el.value.trim() : '';
        };
        const name = getVal('[name="name"]');
        const phone = getVal('[name="phone"]');
        const email = getVal('[name="email"]');

        // 必填校验：姓名 / 邮箱 / 电话（与页面上标红的 * 一致）
        if (!name || !phone) {
            alert(isEN ? 'Please fill in your name and phone / WhatsApp.' : '请填写姓名与电话 / WhatsApp。');
            return;
        }
        if (!email) {
            alert(isEN ? 'Please fill in your email address.' : '请填写电子邮箱。');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert(isEN ? 'Please check the email address format.' : '电子邮箱格式好像不对，请检查一下。');
            return;
        }

        // 蜜罐拦截：填了隐藏字段的一律当成机器人，静默丢弃
        const hp = inquiryForm.querySelector('[name="website"]');
        if (hp && hp.value.trim()) {
            inquiryForm.reset();
            return;
        }

        const btn = inquiryForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = isEN ? 'Sending...' : '提交中...';

        const action = inquiryForm.getAttribute('action') || '';
        const formData = new FormData(inquiryForm);

        // 若已配置表单服务（Formspree / Web3Forms 等），真实发送
        if (action && !action.includes('xxxxxxxx') && !action.startsWith('#')) {
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(res => {
                if (!res.ok) throw new Error('submit failed');
                // 只清空用户输入的字段，保留 URL 预填的品类与需求模板
                inquiryForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea')
                    .forEach(el => { if (!el.hasAttribute('data-prefilled')) el.value = ''; });
                const modal = document.getElementById('successModal');
                if (modal) {
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            })
            .catch(err => {
                console.error(err);
                alert(isEN
                    ? 'Submission failed. Please email us directly at the address on this page.'
                    : '提交失败，请直接发送邮件给我们。');
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            });
        } else {
            // 未配置表单服务（Formspree / Web3Forms）时，回退为调用本机邮件客户端
            console.log('询价表单数据：', Object.fromEntries(formData));
            const data = Object.fromEntries(formData);
            const mailto = buildMailtoUrl(data, isEN);
            window.location.href = mailto;
            btn.disabled = false;
            btn.textContent = originalText;
            // mailto 兜底没有真正的"提交成功"，这里给一个明确提示 + WhatsApp 快捷入口
            setTimeout(() => {
                const modal = document.getElementById('successModal');
                if (!modal) return;
                const h3 = modal.querySelector('h3');
                const p = modal.querySelector('p');
                if (h3) h3.textContent = isEN ? 'Your email client is open' : '您的邮件客户端已打开';
                if (p) p.innerHTML = isEN
                    ? 'Please click <strong>Send</strong> in your mail app to complete the enquiry. If it did not open, email us directly or use WhatsApp below.'
                    : '请在邮件客户端里点击<b>发送</b>完成提交；若未自动打开，可直接发邮件给我们，或用右下角 WhatsApp 联系。';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }, 700);
        }
    });
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 点击成功弹窗背景关闭
document.getElementById('successModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        closeSuccessModal();
    }
});

// 滚动动画（可选，增强效果）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察需要动画的元素（带兜底：JS 异常/不支持时直接显示，绝不留白）
const animEls = document.querySelectorAll('.card, .step, .timeline-item');
const showAll = () => animEls.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
});

if (!('IntersectionObserver' in window)) {
    showAll();
} else {
    animEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    // 兜底：2.5 秒后仍未显示的强制显示
    setTimeout(() => {
        animEls.forEach(el => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
            }
        });
    }, 2500);
}

// 用户开启"减少动态效果"时不做入场动画
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
}

// 添加动画类
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ─────────────────────────────────────────────
// 询盘上下文：产品页 → 询价 → 表单自动带入
// ─────────────────────────────────────────────
(function () {
    const CAT_LABELS = {
        zh: {
            'mask-material': '口罩原材料卷材（非织造布 / 复合材料 / 熔喷布）',
            mask: 'N95 / FFP3 成品口罩（医用 / 民用）',
            ppe: '防护服与隔离衣（PPE 防护服装）',
            'mask-machine': '口罩生产设备（口罩机 / 熔喷生产线）',
            breaker: '断路器与低压电气元件',
            casting: '铸造件（铁 / 钢 / 不锈钢 / 铝）',
            hdpe: 'HDPE 塑料制品',
            lifting: '起重机械与索具',
            custom: '定制 / 多品类组合供货',
            other: '其他工业品 / 全品类采购委托'
        },
        en: {
            'mask-material': 'Mask Material Rolls (Non-Woven / Composite / Meltblown)',
            mask: 'N95 / FFP3 Finished Masks (medical / civilian)',
            ppe: 'Protective Coveralls & Isolation Gowns',
            'mask-machine': 'Mask Making Machinery / Meltblown Lines',
            breaker: 'Circuit Breakers & Low-Voltage Components',
            casting: 'Castings — Cast Iron / Steel / Stainless / Aluminium',
            hdpe: 'HDPE Plastic Products',
            lifting: 'Lifting Machinery & Rigging',
            custom: 'Custom / Multi-category supply',
            other: 'Other industrial goods / full-category sourcing'
        }
    };

    const isEN = document.documentElement.lang === 'en';
    const labels = isEN ? CAT_LABELS.en : CAT_LABELS.zh;

    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');

    // 1) 自动选中品类
    if (cat && labels[cat]) {
        const sel = document.querySelector('select[name="category"]');
        if (sel) {
            sel.value = cat;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 2) 预填需求描述
        const req = document.querySelector('textarea[name="requirement"]');
        if (req && !req.value.trim()) {
            req.value = isEN
                ? `Category: ${labels[cat]}\nQuantity: \nDestination: \nSpecification / application: `
                : `产品品类：${labels[cat]}\n采购数量：\n目的国家/地区：\n规格或用途要求：`;
            req.setAttribute('data-prefilled', '1');
        }

        // 3) 页面上提示一下"已自动带入品类"
        const hint = document.querySelector('.form-hint');
        if (hint) {
            hint.textContent = isEN
                ? `Pre-filled from the product page: ${labels[cat]} — please complete the remaining details.`
                : `已根据你浏览的产品自动带入品类「${labels[cat]}」，请补全其余信息。`;
        }
    }

    // 4) WhatsApp 悬浮按钮按品类预填文案
    const wa = document.querySelector('.wa-float');
    if (wa) {
        const base = isEN
            ? "Hello, I'm interested in your products."
            : '你好，我想咨询你们的产品。';
        let msg = base;
        if (cat && labels[cat]) {
            msg = isEN
                ? `Hello, I'm interested in ${labels[cat]}. Please send me a quotation.`
                : `你好，我需要询价「${labels[cat]}」，请提供报价与交期。`;
        }
        wa.setAttribute('href', `https://wa.me/8613901210451?text=${encodeURIComponent(msg)}`);
    }
})();

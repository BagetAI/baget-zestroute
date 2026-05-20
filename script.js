const DB_ID = "zestroute-waitlist-612";
const API_BASE = "https://app.baget.ai/api/public/databases";

// Inlined database or fallback seed values to avoid network lag when loading specification panel
const RECIPE_DATA = {
    "ZK-THAI-001": {
        "sku": "ZK-THAI-001",
        "recipe_name": "Thai Green Curry",
        "region": "Southeast Asia",
        "key_spices": ["Green Chile", "Lemongrass", "Galangal", "Makrut Lime Leaf", "Coriander Seed", "Cumin", "White Pepper"],
        "prep_time": 15,
        "difficulty": "Medium",
        "supplier_cost": 1.15,
        "retail_price": 5.99,
        "description": "A vibrant, aromatic spice blend capturing the authentic málà balance with premium milled galangal and citrusy makrut lime leaves. Bypasses 20 minutes of pounding raw roots in a mortar."
    },
    "ZK-MOR-002": {
        "sku": "ZK-MOR-002",
        "recipe_name": "Moroccan Chicken Tagine",
        "region": "North Africa",
        "key_spices": ["Sweet Paprika", "Cumin", "Ginger", "Turmeric", "Cinnamon", "Black Pepper", "Saffron"],
        "prep_time": 10,
        "difficulty": "Easy",
        "supplier_cost": 1.45,
        "retail_price": 5.99,
        "description": "An earthy, warm, and sweet spice combination featuring authentic Moroccan saffron and ground ginger for rich, slow-braised complexity in a standard skillet in 20 minutes."
    },
    "ZK-SZE-003": {
        "sku": "ZK-SZE-003",
        "recipe_name": "Szechuan Mapo Tofu",
        "region": "East Asia",
        "key_spices": ["Sichuan Peppercorn (Grade A)", "Dried Red Szechuan Chile", "White Sesame", "Five-Spice Powder"],
        "prep_time": 10,
        "difficulty": "Medium",
        "supplier_cost": 0.95,
        "retail_price": 5.99,
        "description": "A fiery, tongue-numbing málà seasoning mix featuring hand-selected Grade A coarse-ground red Sichuan peppercorns."
    },
    "ZK-IND-004": {
        "sku": "ZK-IND-004",
        "recipe_name": "Indian Butter Chicken",
        "region": "South Asia",
        "key_spices": ["Kashmiri Chili", "Garam Masala", "Coriander", "Kasuri Methi (Fenugreek)", "Cardamom"],
        "prep_time": 10,
        "difficulty": "Easy",
        "supplier_cost": 1.20,
        "retail_price": 5.99,
        "description": "A highly concentrated, deeply aromatic spice blend featuring vibrant red Kashmiri chili and sweet, fragrant green cardamom."
    },
    "ZK-MEX-005": {
        "sku": "ZK-MEX-005",
        "recipe_name": "Mexican Al Pastor Tacos",
        "region": "Latin America",
        "key_spices": ["Achiote Powder", "Guajillo Chile", "Pasilla Chile", "Mexican Oregano", "Garlic", "Cumin"],
        "prep_time": 15,
        "difficulty": "Easy",
        "supplier_cost": 0.85,
        "retail_price": 5.99,
        "description": "An authentic al pastor dry rub with rich achiote and rehydrated chile notes for a perfect street-taco char in under 15 minutes."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Count
    updateSignupCount();

    // Default inspector item
    renderSpecification("ZK-THAI-001");

    // Form submission logic
    const form = document.getElementById('waitlist-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        submitBtn.disabled = true;
        submitBtn.textContent = 'EXECUTING...';

        try {
            const response = await fetch(`${API_BASE}/${DB_ID}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        email: email,
                        source: window.location.hostname
                    }
                })
            });

            if (response.ok) {
                messageDiv.textContent = "SUCCESS: YOU ARE SECURED ON THE EXCLUSIVE BETA WAITLIST.";
                messageDiv.className = 'success';
                messageDiv.classList.remove('hidden');
                form.querySelector('.input-group').classList.add('hidden');
                updateSignupCount();
            } else {
                throw new Error('Failed to join');
            }
        } catch (error) {
            messageDiv.textContent = "ERR: TRANSACTION_FAILED. PLEASE ATTEMPT REGISTRATION AGAIN.";
            messageDiv.className = 'error';
            messageDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'EXECUTE()';
        }
    });

    // Dynamic Catalog Selection
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const sku = card.getAttribute('data-sku');
            renderSpecification(sku);
        });
    });
});

async function updateSignupCount() {
    try {
        const response = await fetch(`${API_BASE}/${DB_ID}/count`);
        const data = await response.json();
        const countSpan = document.getElementById('signup-count');
        
        // Base starting count of 142 + real rows for production authenticity
        const total = 142 + (data.count || 0);
        countSpan.textContent = total;
    } catch (e) {
        document.getElementById('signup-count').textContent = "142";
    }
}

function renderSpecification(sku) {
    const data = RECIPE_DATA[sku];
    const viewer = document.getElementById('recipe-spec-viewer');
    if (!data || !viewer) return;

    // Build interactive tech-forward spec sheet
    const spiceTagsHTML = data.key_spices.map(spice => `<span class="spice-tag">${spice}</span>`).join('');
    
    viewer.innerHTML = `
        <div class="spec-grid">
            <div class="spec-list">
                <div class="spec-row">
                    <span class="spec-label">RECIPE_NAME:</span>
                    <span class="spec-val" style="color: var(--accent-orange);">${data.recipe_name}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">SKU_NUMBER:</span>
                    <span class="spec-val">${data.sku}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">REGION_CODE:</span>
                    <span class="spec-val">${data.region}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">EST_ACTIVE_PREP:</span>
                    <span class="spec-val">${data.prep_time} MINS</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">COMPILER_DIFFICULTY:</span>
                    <span class="spec-val">${data.difficulty}</span>
                </div>
            </div>
            <div class="spec-list">
                <div class="spec-row">
                    <span class="spec-label">UNIT_RETAIL_PRICE:</span>
                    <span class="spec-val">$${data.retail_price}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">FORMULATION_COGS:</span>
                    <span class="spec-val">$${data.supplier_cost}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <span class="spec-label" style="display: block; margin-bottom: 0.5rem; font-size: 0.8rem;">KEY_ACTIVE_SPICES:</span>
                    <div class="spice-tags">
                        ${spiceTagsHTML}
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px dashed var(--border-color); font-size: 0.85rem; color: var(--text-muted);">
            <span style="color: var(--accent-cyan); font-weight: bold;">DESCRIPTION_STREAM:</span> ${data.description}
        </div>
    `;
}

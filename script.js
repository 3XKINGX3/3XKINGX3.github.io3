'use strict';

const priceConfig = {
    serviceTypes: {
        1: { basePrice: 1000, name: "Базовая услуга" },
        2: { basePrice: 2500, name: "Расширенная услуга" },
        3: { basePrice: 5000, name: "Премиум услуга" }
    },
    options: {
        standard: 0,
        express: 500,
        vip: 1500
    },
    properties: {
        support: 300,
        consulting: 700,
        priority: 1000
    }
};

const quantityInput = document.getElementById('quantity');
const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
const optionsGroup = document.getElementById('optionsGroup');
const propertiesGroup = document.getElementById('propertiesGroup');
const serviceOptionSelect = document.getElementById('serviceOption');
const propertyCheckboxes = document.querySelectorAll('input[name="property"]');
const priceDisplay = document.getElementById('priceDisplay');

function updateFormVisibility() {
    const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
    if (!selectedRadio) return;
    
    const selectedServiceType = selectedRadio.value;
    
    switch (selectedServiceType) {
        case '1':
            optionsGroup.classList.add('hidden');
            propertiesGroup.classList.add('hidden');
            break;
        case '2':
            optionsGroup.classList.remove('hidden');
            propertiesGroup.classList.add('hidden');
            break;
        case '3':
            optionsGroup.classList.add('hidden');
            propertiesGroup.classList.remove('hidden');
            break;
        default:
            break;
    }
}

function calculatePrice() {
    const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
    if (!selectedRadio) return 0;
    
    const quantity = parseInt(quantityInput.value, 10) || 1;
    const selectedServiceType = selectedRadio.value;
    
    const servicePrice = priceConfig.serviceTypes[selectedServiceType];
    if (!servicePrice) return 0;
    
    let totalPrice = servicePrice.basePrice;
    
    if (selectedServiceType === '2') {
        const selectedOption = serviceOptionSelect.value;
        const optionPrice = priceConfig.options[selectedOption];
        if (optionPrice !== undefined) {
            totalPrice += optionPrice;
        }
    }
    
    if (selectedServiceType === '3') {
        let i;
        for (i = 0; i < propertyCheckboxes.length; i += 1) {
            const checkbox = propertyCheckboxes[i];
            if (checkbox.checked) {
                const propertyPrice = priceConfig.properties[checkbox.value];
                if (propertyPrice !== undefined) {
                    totalPrice += propertyPrice;
                }
            }
        }
    }
    
    totalPrice *= quantity;
    
    return totalPrice;
}

function updatePriceDisplay() {
    const totalPrice = calculatePrice();
    if (priceDisplay) {
        priceDisplay.textContent = "Общая стоимость: " + totalPrice + " рублей";
    }
}

function initEventListeners() {
    let i;
    
    for (i = 0; i < serviceTypeRadios.length; i += 1) {
        serviceTypeRadios[i].addEventListener('change', function () {
            updateFormVisibility();
            updatePriceDisplay();
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', updatePriceDisplay);
    }
    
    if (serviceOptionSelect) {
        serviceOptionSelect.addEventListener('change', updatePriceDisplay);
    }
    
    for (i = 0; i < propertyCheckboxes.length; i += 1) {
        propertyCheckboxes[i].addEventListener('change', updatePriceDisplay);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        updateFormVisibility();
        updatePriceDisplay();
        initEventListeners();
    });
} else {
    updateFormVisibility();
    updatePriceDisplay();
    initEventListeners();
}
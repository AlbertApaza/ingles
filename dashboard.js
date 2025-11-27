// Royal Cuts Dashboard - Complete JavaScript
// All data stored in memory (localStorage for persistence)

// ============================================
// DATA STORAGE & INITIALIZATION
// ============================================

// Initialize default data
const defaultData = {
    battles: {
        total: 2847,
        customerWins: 982,
        customerLosses: 1865,
        monthlyBattles: 1247
    },
    revenue: {
        total: 128450,
        monthlyRevenue: 45200,
        moneyLost: 38750,
        extraRevenue: 72350,
        netProfit: 33600
    },
    customers: {
        new: 1196,
        returning: 1651,
        avgVisits: 3.2,
        retentionRate: 68
    },
    services: {
        kings: { name: "King's Package", count: 1243, price: 65, revenue: 80795 },
        fade: { name: "Royal Fade", count: 892, price: 45, revenue: 40140 },
        classic: { name: "Classic Cut", count: 567, price: 30, revenue: 17010 },
        beard: { name: "Beard Trim", count: 98, price: 25, revenue: 2450 },
        kids: { name: "Kids Cut", count: 47, price: 20, revenue: 940 }
    },
    recentBattles: [],
    lastUpdate: new Date().toISOString()
};

// Load data from localStorage or use defaults
function loadData() {
    const stored = localStorage.getItem('royalCutsDashboard');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data:', e);
            return defaultData;
        }
    }
    return defaultData;
}

// Save data to localStorage
function saveData(data) {
    try {
        data.lastUpdate = new Date().toISOString();
        localStorage.setItem('royalCutsDashboard', JSON.stringify(data));
        showToast('Data saved successfully!', 'success');
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('Error saving data', 'error');
        return false;
    }
}

// Global data object
let dashboardData = loadData();

// Generate recent battles if empty
if (dashboardData.recentBattles.length === 0) {
    dashboardData.recentBattles = generateRecentBattles(20);
}

// ============================================
// NAVIGATION & SECTIONS
// ============================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.style.display = 'block';
    }

    // Add active class to clicked tab
    const tab = document.querySelector(`[data-tab="${sectionName}"]`);
    if (tab) {
        tab.classList.add('active');
    }

    // Load section-specific data
    loadSectionData(sectionName);
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'overview':
            renderOverview();
            break;
        case 'revenue':
            renderRevenue();
            break;
        case 'customers':
            renderCustomers();
            break;
        case 'services':
            renderServices();
            break;
        case 'battles':
            renderBattles();
            break;
        case 'reports':
            renderReports();
            break;
        case 'settings':
            renderSettings();
            break;
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderOverview() {
    // Update stats
    document.getElementById('total-battles').textContent = dashboardData.battles.total.toLocaleString();
    document.getElementById('customer-wins').textContent = dashboardData.battles.customerWins.toLocaleString();
    document.getElementById('customer-losses').textContent = dashboardData.battles.customerLosses.toLocaleString();
    document.getElementById('total-revenue').textContent = `S/.${dashboardData.revenue.total.toLocaleString()}`;

    // Update last update time
    const lastUpdate = new Date(dashboardData.lastUpdate);
    document.getElementById('last-update').textContent = formatRelativeTime(lastUpdate);

    // Render charts
    renderTrendsChart();
    renderRevenueChart();

    // Render recent battles
    renderRecentBattles();
}

function renderRevenue() {
    // Revenue data is already in the HTML, just needs updates if changed
    updateRevenueDisplay();
}

function renderCustomers() {
    document.getElementById('new-customers').textContent = dashboardData.customers.new.toLocaleString();
    document.getElementById('returning-customers').textContent = dashboardData.customers.returning.toLocaleString();
    document.getElementById('avg-visits').textContent = `${dashboardData.customers.avgVisits}x`;
    document.getElementById('retention-rate').textContent = `${dashboardData.customers.retentionRate}%`;
}

function renderServices() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    Object.values(dashboardData.services).forEach((service, index) => {
        const percentage = ((service.count / dashboardData.battles.total) * 100).toFixed(1);

        servicesList.innerHTML += `
            <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-royal-500/50 transition-colors">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-royal-500/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <h4 class="font-bold">${service.name}</h4>
                        <p class="text-sm text-gray-400">${service.count} bookings • S/.${service.price} each</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-gold-400">S/.${service.revenue.toLocaleString()}</p>
                    <p class="text-sm text-gray-400">${percentage}% of total</p>
                </div>
            </div>
        `;
    });
}

function renderBattles() {
    const battlesList = document.getElementById('battles-list');
    battlesList.innerHTML = '';

    dashboardData.recentBattles.slice(0, 50).forEach(battle => {
        const isWin = battle.result === 'win';
        const icon = isWin ? 'fa-trophy' : 'fa-coins';
        const color = isWin ? 'text-red-400' : 'text-green-400';
        const bgColor = isWin ? 'bg-red-500/10' : 'bg-green-500/10';
        const borderColor = isWin ? 'border-red-500/30' : 'border-green-500/30';

        battlesList.innerHTML += `
            <div class="flex items-center justify-between p-4 ${bgColor} rounded-xl border ${borderColor}">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center">
                        <i class="fas ${icon} ${color}"></i>
                    </div>
                    <div>
                        <p class="font-semibold">${battle.customer}</p>
                        <p class="text-sm text-gray-400">${battle.service}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${color}">${isWin ? 'Customer Won' : 'Customer Lost'}</p>
                    <p class="text-sm text-gray-400">S/.${battle.amount.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

function renderRecentBattles() {
    const container = document.getElementById('recent-battles');
    container.innerHTML = '';

    dashboardData.recentBattles.slice(0, 10).forEach(battle => {
        const isWin = battle.result === 'win';
        const icon = isWin ? 'fa-trophy' : 'fa-coins';
        const color = isWin ? 'text-red-400' : 'text-green-400';

        container.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div class="flex items-center space-x-3">
                    <i class="fas ${icon} ${color}"></i>
                    <div>
                        <p class="font-semibold text-sm">${battle.customer}</p>
                        <p class="text-xs text-gray-400">${battle.service}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold ${color}">${isWin ? 'Won' : 'Lost'}</p>
                    <p class="text-xs text-gray-400">S/.${battle.amount.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

function renderReports() {
    // Reports section is mostly static forms
}

function renderSettings() {
    // Settings section is mostly static forms
}

// ============================================
// CHARTS
// ============================================

let trendsChart = null;
let revenueChart = null;

function renderTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;

    // Generate data for last 30 days
    const labels = [];
    const winsData = [];
    const lossesData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        // Simulate data
        const dailyWins = Math.floor(Math.random() * 20) + 25;
        const dailyLosses = Math.floor(Math.random() * 30) + 45;
        winsData.push(dailyWins);
        lossesData.push(dailyLosses);
    }

    if (trendsChart) {
        trendsChart.destroy();
    }

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Customer Wins',
                    data: winsData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Customer Losses',
                    data: lossesData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#9ca3af' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const services = Object.values(dashboardData.services);
    const labels = services.map(s => s.name);
    const data = services.map(s => s.revenue);

    if (revenueChart) {
        revenueChart.destroy();
    }

    revenueChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#fbbf24',
                    '#a855f7',
                    '#38bdf8',
                    '#22c55e',
                    '#f59e0b'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff', padding: 15 }
                }
            }
        }
    });
}

// ============================================
// FORM HANDLERS
// ============================================

// Update Revenue Form
document.addEventListener('DOMContentLoaded', () => {
    const revenueForm = document.getElementById('update-revenue-form');
    if (revenueForm) {
        revenueForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const moneyLost = parseFloat(document.getElementById('money-lost-input').value);
            const extraRevenue = parseFloat(document.getElementById('extra-revenue-input').value);

            if (isNaN(moneyLost) || isNaN(extraRevenue)) {
                showToast('Please enter valid numbers', 'error');
                return;
            }

            if (moneyLost < 0 || extraRevenue < 0) {
                showToast('Values cannot be negative', 'error');
                return;
            }

            dashboardData.revenue.moneyLost = moneyLost;
            dashboardData.revenue.extraRevenue = extraRevenue;
            dashboardData.revenue.netProfit = extraRevenue - moneyLost;

            saveData(dashboardData);
            updateRevenueDisplay();
        });
    }

    // Add Customer Form
    const customerForm = document.getElementById('add-customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('customer-name').value;
            const email = document.getElementById('customer-email').value;
            const type = document.getElementById('customer-type').value;

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            if (type === 'new') {
                dashboardData.customers.new++;
            } else {
                dashboardData.customers.returning++;
            }

            saveData(dashboardData);
            renderCustomers();
            customerForm.reset();
            showToast(`Customer ${name} added successfully!`, 'success');
        });
    }

    // Update Pricing Form
    const pricingForm = document.getElementById('update-pricing-form');
    if (pricingForm) {
        pricingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const service = document.getElementById('service-select').value;
            const newPrice = parseFloat(document.getElementById('new-price').value);

            if (isNaN(newPrice) || newPrice <= 0) {
                showToast('Please enter a valid price', 'error');
                return;
            }

            if (dashboardData.services[service]) {
                dashboardData.services[service].price = newPrice;
                saveData(dashboardData);
                renderServices();
                showToast('Price updated successfully!', 'success');
            }
        });
    }

    // Add Battle Form
    const battleForm = document.getElementById('add-battle-form');
    if (battleForm) {
        battleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const customer = document.getElementById('battle-customer').value;
            const service = document.getElementById('battle-service').value;
            const result = document.getElementById('battle-result').value;
            const amount = parseFloat(document.getElementById('battle-amount').value);

            if (!customer || !service || !result || isNaN(amount)) {
                showToast('Please fill all fields correctly', 'error');
                return;
            }

            // Add to recent battles
            dashboardData.recentBattles.unshift({
                customer,
                service,
                result,
                amount,
                timestamp: new Date().toISOString()
            });

            // Update totals
            dashboardData.battles.total++;
            if (result === 'win') {
                dashboardData.battles.customerWins++;
                dashboardData.revenue.moneyLost += amount;
            } else {
                dashboardData.battles.customerLosses++;
                dashboardData.revenue.extraRevenue += amount;
            }

            dashboardData.revenue.total += (result === 'win' ? 0 : amount);
            dashboardData.revenue.netProfit = dashboardData.revenue.extraRevenue - dashboardData.revenue.moneyLost;

            saveData(dashboardData);
            renderOverview();
            renderBattles();
            battleForm.reset();
            showToast('Battle recorded successfully!', 'success');
        });
    }

    // PDF Report Form
    const pdfForm = document.getElementById('pdf-report-form');
    if (pdfForm) {
        pdfForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generatePDFReport();
        });
    }

    // Email Report Form
    const emailForm = document.getElementById('email-report-form');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('report-email').value;
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Simulate sending email
            showToast('Sending report...', 'info');
            setTimeout(() => {
                showToast(`Report sent successfully to ${email}!`, 'success');
            }, 2000);
        });
    }

    // Settings Form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Settings saved successfully!', 'success');
        });
    }

    // Schedule Report Form
    const scheduleForm = document.getElementById('schedule-report-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Report schedule updated!', 'success');
        });
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function updateRevenueDisplay() {
    // This would update the revenue cards in the Revenue section
    renderOverview(); // Refresh overview as well
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatRelativeTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

function generateRecentBattles(count) {
    const battles = [];
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Chris Brown', 'Emma Davis', 'Alex Martinez', 'Lisa Anderson', 'Tom Wilson', 'Amy Taylor'];
    const services = ["King's Package", 'Royal Fade', 'Classic Cut'];

    for (let i = 0; i < count; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const result = Math.random() > 0.35 ? 'loss' : 'win';
        const basePrice = service === "King's Package" ? 65 : service === 'Royal Fade' ? 45 : 30;
        const amount = result === 'loss' ? basePrice * 2 : 0;

        battles.push({
            customer: customers[Math.floor(Math.random() * customers.length)],
            service,
            result,
            amount,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }

    return battles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToCSV(type) {
    let csvContent = '';
    let filename = '';

    switch (type) {
        case 'battles':
            csvContent = 'Customer,Service,Result,Amount,Date\n';
            dashboardData.recentBattles.forEach(battle => {
                csvContent += `${battle.customer},${battle.service},${battle.result === 'win' ? 'Customer Won' : 'Customer Lost'},${battle.amount},${new Date(battle.timestamp).toLocaleDateString()}\n`;
            });
            filename = 'battles_export.csv';
            break;

        case 'revenue':
            csvContent = 'Metric,Value\n';
            csvContent += `Total Revenue,S/.${dashboardData.revenue.total}\n`;
            csvContent += `Money Lost,S/.${dashboardData.revenue.moneyLost}\n`;
            csvContent += `Extra Revenue,S/.${dashboardData.revenue.extraRevenue}\n`;
            csvContent += `Net Profit,S/.${dashboardData.revenue.netProfit}\n`;
            filename = 'revenue_export.csv';
            break;

        case 'customers':
            csvContent = 'Metric,Value\n';
            csvContent += `New Customers,${dashboardData.customers.new}\n`;
            csvContent += `Returning Customers,${dashboardData.customers.returning}\n`;
            csvContent += `Average Visits,${dashboardData.customers.avgVisits}\n`;
            csvContent += `Retention Rate,${dashboardData.customers.retentionRate}%\n`;
            filename = 'customers_export.csv';
            break;
    }

    downloadCSV(csvContent, filename);
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`, 'success');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generatePDFReport() {
    showToast('Generating PDF report...', 'info');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(14, 165, 233);
        doc.text('ROYAL CUTS BARBERSHOP', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Business Report', 105, 28, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });

        // Overview Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Business Overview', 20, 50);

        doc.setFontSize(10);
        doc.text(`Total Battles: ${dashboardData.battles.total}`, 20, 60);
        doc.text(`Customer Wins: ${dashboardData.battles.customerWins} (${((dashboardData.battles.customerWins / dashboardData.battles.total) * 100).toFixed(1)}%)`, 20, 67);
        doc.text(`Customer Losses: ${dashboardData.battles.customerLosses} (${((dashboardData.battles.customerLosses / dashboardData.battles.total) * 100).toFixed(1)}%)`, 20, 74);

        // Revenue Section
        doc.setFontSize(14);
        doc.text('Revenue Analytics', 20, 90);

        doc.setFontSize(10);
        doc.text(`Total Revenue: S/.${dashboardData.revenue.total.toLocaleString()}`, 20, 100);
        doc.text(`Money Lost (Free Cuts): S/.${dashboardData.revenue.moneyLost.toLocaleString()}`, 20, 107);
        doc.text(`Extra Revenue (Double Payments): S/.${dashboardData.revenue.extraRevenue.toLocaleString()}`, 20, 114);
        doc.text(`Net Challenge Profit: S/.${dashboardData.revenue.netProfit.toLocaleString()}`, 20, 121);

        // Customer Section
        doc.setFontSize(14);
        doc.text('Customer Insights', 20, 137);

        doc.setFontSize(10);
        doc.text(`New Customers: ${dashboardData.customers.new}`, 20, 147);
        doc.text(`Returning Customers: ${dashboardData.customers.returning}`, 20, 154);
        doc.text(`Average Visits: ${dashboardData.customers.avgVisits}x`, 20, 161);
        doc.text(`Retention Rate: ${dashboardData.customers.retentionRate}%`, 20, 168);

        // Services Section
        doc.setFontSize(14);
        doc.text('Top Services', 20, 184);

        doc.setFontSize(10);
        let yPos = 194;
        Object.values(dashboardData.services).slice(0, 5).forEach(service => {
            doc.text(`${service.name}: ${service.count} bookings - S/.${service.revenue.toLocaleString()}`, 20, yPos);
            yPos += 7;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Royal Cuts Barbershop - Gaming meets Grooming', 105, 280, { align: 'center' });

        // Save
        doc.save('royal_cuts_report.pdf');
        showToast('PDF report downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Error generating PDF report', 'error');
    }
}

// ============================================
// DATA MANAGEMENT
// ============================================

function refreshData() {
    dashboardData = loadData();
    renderOverview();
    showToast('Data refreshed!', 'success');
}

function clearCache() {
    if (confirm('Are you sure you want to clear the cache? This will not delete your data.')) {
        showToast('Cache cleared!', 'success');
    }
}

function resetData() {
    if (confirm('⚠️ WARNING: This will delete ALL data and reset to defaults. This action cannot be undone. Are you sure?')) {
        if (confirm('Are you ABSOLUTELY sure? All battles, customers, and revenue data will be lost!')) {
            dashboardData = JSON.parse(JSON.stringify(defaultData));
            dashboardData.recentBattles = generateRecentBattles(20);
            saveData(dashboardData);
            renderOverview();
            showToast('All data has been reset to defaults', 'warning');
            setTimeout(() => location.reload(), 2000);
        }
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: 'from-green-600 to-green-700',
        error: 'from-red-600 to-red-700',
        warning: 'from-yellow-600 to-yellow-700',
        info: 'from-blue-600 to-blue-700'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center space-x-3 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} text-xl"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// ============================================
// INITIALIZE ON LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Show overview section by default
    showSection('overview');

    // Update time every minute
    setInterval(() => {
        const lastUpdate = new Date(dashboardData.lastUpdate);
        document.getElementById('last-update').textContent = formatRelativeTime(lastUpdate);
    }, 60000);
});

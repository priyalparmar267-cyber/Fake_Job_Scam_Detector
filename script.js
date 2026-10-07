
function analyzeMessage() {
    const messageBox = document.getElementById("jobMessage");
    const result = document.getElementById("result");
    const message = messageBox.value.trim();

    if (!message) {
        result.innerHTML = `
            <div class="result-box">
                <h3>Please enter a message</h3>
                <p>Paste a recruitment message before analyzing it.</p>
            </div>`;
        return;
    }

    const text = message.toLowerCase();
    let score = 0;
    const warnings = [];

    // 1. Requests for money
    const paymentPattern =
        /\b(registration fees?|processing charges?|processing fees?|security deposits?|joining fees?|training fees?|refundable deposits?|application fees?|pay(?:ment)? required|send money|pay\s+(?:rs\.?|inr|₹|\$)?\s*\d+|deposit of)\b/i;

    if (paymentPattern.test(text)) {
        score += 35;
        warnings.push(
            "The message may request money or a job-related fee."
        );
    }

    // 2. Sensitive information requests
    const sensitivePattern =
        /\b(otp|one[- ]time password|upi pin|cvv|bank details|bank account details|card number|password|account pin)\b/i;

    if (sensitivePattern.test(text)) {
        score += 35;
        warnings.push(
            "The message mentions sensitive financial or account information."
        );
    }

    // 3. Urgency and pressure
    const urgencyPattern =
        /\b(act now|immediately|urgent|today only|limited seats|last chance|within 24 hours|hurry|right now|don't delay|do not delay)\b/i;

    if (urgencyPattern.test(text)) {
        score += 15;
        warnings.push(
            "The message uses urgency or pressure to encourage quick action."
        );
    }

    // 4. Unrealistic or guaranteed earnings
    const salaryPattern =
        /\b(guaranteed salary|guaranteed income|easy money|huge salary|earn\s+(?:₹|rs\.?|inr)?\s*\d{2,}|no experience.*high salary|high salary.*no experience)\b/i;

    if (salaryPattern.test(text)) {
        score += 15;
        warnings.push(
            "The message may promise unusually high or guaranteed earnings."
        );
    }

    // 5. Unusual selection process
    const selectionPattern =
        /\b(selected without interview|no interview|instant selection|direct selection|selected immediately|job confirmed without interview)\b/i;

    if (selectionPattern.test(text)) {
        score += 12;
        warnings.push(
            "The message suggests selection without a normal recruitment process."
        );
    }

    // 6. Informal communication channels
    const contactPattern =
        /\b(whatsapp only|contact only on whatsapp|telegram only|message us on telegram|whatsapp recruiter)\b/i;

    if (contactPattern.test(text)) {
        score += 10;
        warnings.push(
            "The recruiter appears to rely on informal messaging channels."
        );
    }

    // Keep score within 0–100
    score = Math.min(score, 100);

    let riskLevel;
    let riskMessage;
    let riskClass;

    if (score >= 50) {
        riskLevel = "HIGH RISK";
        riskClass = "high-risk";
        riskMessage =
            "Several warning signs associated with recruitment scams were detected.";
    } else if (score >= 25) {
        riskLevel = "SUSPICIOUS";
        riskClass = "suspicious-risk";
        riskMessage =
            "Some warning signs were detected. Verify the employer before proceeding.";
    } else {
        riskLevel = "LOW RISK";
        riskClass = "low-risk";
        riskMessage =
            "Few or no warning signs were detected by these rules. This does not prove the message is genuine.";
    }

    let warningHTML;

    if (warnings.length === 0) {
        warningHTML = `
            <p>No specific warning signs were detected by the current rules.</p>`;
    } else {
        warningHTML = `
            <ul>
                ${warnings.map(warning => `<li>${warning}</li>`).join("")}
            </ul>`;
    }

    result.innerHTML = `
    <div class="result-box ${riskClass}">

        <div class="result-header">
            <div>
                <span class="result-label">ANALYSIS RESULT</span>
                <h3>${riskLevel}</h3>
            </div>

            <div class="score-circle">
                <strong>${score}</strong>
                <span>/100</span>
            </div>
        </div>

        <div class="risk-meter"
             role="progressbar"
             aria-label="Estimated risk score"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-valuenow="${score}">
            <div class="risk-fill" style="width: ${score}%"></div>
        </div>

        <p class="risk-description">
            ${riskMessage}
        </p>

        <div class="result-section">

            <h4>🚨 Detected Warning Signs</h4>

            ${warningHTML}

        </div>

        <div class="result-section recommendation">

            <h4>🛡️ Safety Recommendation</h4>

            <p>
                Never pay fees to secure a job or share OTPs, PINs,
                passwords, or banking credentials.
                Verify the employer through independently obtained
                official contact details.
            </p>

        </div>

        <p class="disclaimer">
            This is a rule-based screening result, not proof of fraud
            or a guarantee that the message is genuine.
        </p>

    </div>
`;


function clearMessage() {

    document.getElementById("jobMessage").value = "";

    document.getElementById("result").innerHTML = `
        <p>
            Your analysis result will appear here.
        </p>
    `;
}
}function loadExample(type) {

    const messageBox = document.getElementById("jobMessage");

    if (type === "high") {

        messageBox.value =
            "Congratulations! You have been selected for a work from home job. " +
            "Earn ₹60,000 per month with no experience required. " +
            "Pay a refundable registration fee of ₹2,000 today. " +
            "Send your payment confirmation and act immediately. " +
            "Limited seats available.";

    }

    else if (type === "suspicious") {

        messageBox.value =
            "Hello, we have an urgent job opportunity for you. " +
            "You can earn a guaranteed salary from home. " +
            "Your selection will be completed quickly. " +
            "Contact our recruiter on WhatsApp for further details.";

    }

    else if (type === "normal") {

        messageBox.value =
            "Dear Candidate, thank you for applying for the Software Trainee position. " +
            "Our recruitment team will review your application. " +
            "Shortlisted candidates will be contacted for an interview. " +
            "Please visit our official company website for information about the role.";

    }
}
import re

with open('cadastro.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS Updates
css_updates = {
    'max-width: 480px;': 'max-width: 400px;',
    'padding: 48px 40px;': 'padding: 32px 24px;',
    'border-radius: 24px;': 'border-radius: 20px;',
    'font-size: 2rem;': 'font-size: 1.8rem;',
    'margin-bottom: 20px;': 'margin-bottom: 16px;',
    'padding: 14px 16px;': 'padding: 12px 14px;',
    'padding: 16px;': 'padding: 14px;'
}
for old, new in css_updates.items():
    content = content.replace(old, new)

# 2. Add OTP CSS
otp_css = """
        /* OTP Modal */
        .otp-modal { display: none; flex-direction: column; }
        .otp-modal.active { display: flex; animation: slideUp 0.4s ease forwards; }
        .register-form.hidden { display: none; }
        .otp-inputs { display: flex; gap: 8px; justify-content: center; margin: 24px 0; }
        .otp-input { width: 40px; height: 48px; font-size: 1.5rem; text-align: center; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: #fff; }
        .otp-input:focus { border-color: rgba(111, 66, 251, 0.5); outline: none; box-shadow: 0 0 0 3px rgba(111, 66, 251, 0.2); }
"""
content = content.replace('</style>', otp_css + '\n    </style>')

# 3. Add EmailJS Script
content = content.replace('</head>', '    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>\n</head>')

# 4. Wrap HTML form and add OTP Modal
html_to_wrap = """<div class="auth-header">
            <h1 class="auth-title">Criar Conta</h1>
            <p class="auth-subtitle">Crie sua conta para iniciar o teste grátis ou assinar um plano.</p>
        </div>

        <form onsubmit="handleRegister(event)">
            <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="name-input" class="form-input" placeholder="Seu nome" required>
            </div>
            <div class="form-group">
                <label class="form-label">CPF ou CNPJ</label>
                <input type="text" id="cpf-input" class="form-input" placeholder="000.000.000-00" required oninput="formatCpfCnpj(this)">
            </div>
            <div class="form-group">
                <label class="form-label">E-mail</label>
                <input type="email" id="email-input" class="form-input" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
                <label class="form-label">Senha</label>
                <input type="password" id="password-input" class="form-input" placeholder="••••••••" required>
            </div>

            <button type="submit" class="auth-btn" id="submit-btn">Criar Conta</button>
        </form>

        <div class="auth-footer">
            Já tem uma conta? <a href="login.html">Fazer Login</a>
        </div>"""

new_html = """<div id="register-section" class="register-form">
            <div class="auth-header">
                <h1 class="auth-title">Criar Conta</h1>
                <p class="auth-subtitle">Crie sua conta para iniciar o teste grátis ou assinar um plano.</p>
            </div>

            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" id="name-input" class="form-input" placeholder="Seu nome" required>
                </div>
                <div class="form-group">
                    <label class="form-label">CPF ou CNPJ</label>
                    <input type="text" id="cpf-input" class="form-input" placeholder="000.000.000-00" required oninput="formatCpfCnpj(this)" maxlength="18">
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" id="email-input" class="form-input" placeholder="seu@email.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Senha</label>
                    <input type="password" id="password-input" class="form-input" placeholder="••••••••" required>
                </div>

                <button type="submit" class="auth-btn" id="submit-btn">Criar Conta</button>
            </form>

            <div class="auth-footer">
                Já tem uma conta? <a href="login.html">Fazer Login</a>
            </div>
        </div>

        <div id="otp-section" class="otp-modal">
            <div class="auth-header" style="margin-bottom: 0;">
                <h1 class="auth-title">Verifique seu E-mail</h1>
                <p class="auth-subtitle">Enviamos um código de 6 dígitos para <br><strong id="display-email"></strong></p>
            </div>
            <div class="otp-inputs">
                <input type="text" maxlength="1" class="otp-input" oninput="moveToNext(this, 'otp-2')" id="otp-1">
                <input type="text" maxlength="1" class="otp-input" oninput="moveToNext(this, 'otp-3')" id="otp-2">
                <input type="text" maxlength="1" class="otp-input" oninput="moveToNext(this, 'otp-4')" id="otp-3">
                <input type="text" maxlength="1" class="otp-input" oninput="moveToNext(this, 'otp-5')" id="otp-4">
                <input type="text" maxlength="1" class="otp-input" oninput="moveToNext(this, 'otp-6')" id="otp-5">
                <input type="text" maxlength="1" class="otp-input" id="otp-6" onkeyup="checkEnter(event)">
            </div>
            <button type="button" class="auth-btn" id="verify-btn" onclick="verifyOTP()">Confirmar Código</button>
            <div class="auth-footer">
                <a href="#" onclick="backToRegister()">← Voltar e corrigir e-mail</a>
            </div>
        </div>"""

content = content.replace(html_to_wrap, new_html)
# In case the regex didn't perfectly match due to my oninput format addition in string:
# I will use a regex to replace the inner content of auth-container.
auth_container_pattern = re.compile(r'(<div class="auth-container">)(.*?)(    <script>)', re.DOTALL)
content = auth_container_pattern.sub(r'\1\n        ' + new_html + r'\n    </div>\n\n\3', content)

# 5. JavaScript rewrite
new_script = """<script>
        // Inicializa o EmailJS
        (function(){
            emailjs.init({
                publicKey: "Uow5EobsFYol8R5ac",
            });
        })();

        let generatedCode = "";

        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const plan = urlParams.get('plan') || '';
            const btn = document.getElementById('submit-btn');
            if (plan.includes('trial')) {
                btn.innerHTML = 'Criar Conta e Iniciar Teste';
            } else {
                btn.innerHTML = 'Criar Conta e Pagar';
            }
        });

        // Mascara de CPF / CNPJ
        function formatCpfCnpj(input) {
            let v = input.value.replace(/\D/g,"");
            if (v.length <= 11) {
                // CPF
                v = v.replace(/(\d{3})(\d)/,"$1.$2");
                v = v.replace(/(\d{3})(\d)/,"$1.$2");
                v = v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
            } else {
                // CNPJ
                v = v.replace(/^(\d{2})(\d)/,"$1.$2");
                v = v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
                v = v.replace(/\.(\d{3})(\d)/,".$1/$2");
                v = v.replace(/(\d{4})(\d)/,"$1-$2");
            }
            input.value = v;
        }

        // Validacao simples de CPF (Algoritmo Oficial)
        function validarCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g,'');
            if(cpf == '') return false;
            if (cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
            let add = 0;
            for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
            let rev = 11 - (add % 11);
            if (rev == 10 || rev == 11) rev = 0;
            if (rev != parseInt(cpf.charAt(9))) return false;
            add = 0;
            for (let i=0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11) rev = 0;
            if (rev != parseInt(cpf.charAt(10))) return false;
            return true;
        }

        async function handleRegister(e) {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;
            
            const name = document.getElementById('name-input').value;
            const documentVal = document.getElementById('cpf-input').value;
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;

            // Valida CPF
            const digitsOnly = documentVal.replace(/\D/g,"");
            if (digitsOnly.length === 11 && !validarCPF(digitsOnly)) {
                alert("O CPF informado é inválido. Por favor, verifique.");
                return;
            }

            btn.innerHTML = 'Enviando código...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Gera código de 6 digitos
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

            try {
                // ENVIA O EMAIL JS
                // Substitua 'YOUR_SERVICE_ID' e 'YOUR_TEMPLATE_ID' abaixo
                await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                    to_name: name,
                    to_email: email,
                    verification_code: generatedCode
                });

                // Mostra Modal de OTP
                document.getElementById('display-email').innerText = email;
                document.getElementById('register-section').classList.add('hidden');
                document.getElementById('otp-section').classList.add('active');
                
            } catch (err) {
                console.error("Erro EmailJS:", err);
                alert("Erro ao enviar o código de verificação para o e-mail. Verifique suas configurações do EmailJS.");
            } finally {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        }

        // Funcoes do Modal de OTP
        function moveToNext(current, nextId) {
            if (current.value.length >= 1) {
                const next = document.getElementById(nextId);
                if (next) next.focus();
            }
        }
        function checkEnter(e) {
            if (e.key === 'Enter') verifyOTP();
        }
        function backToRegister() {
            document.getElementById('otp-section').classList.remove('active');
            document.getElementById('register-section').classList.remove('hidden');
        }

        async function verifyOTP() {
            const btn = document.getElementById('verify-btn');
            const originalText = btn.innerHTML;
            
            let codeEntered = "";
            for (let i=1; i<=6; i++) {
                codeEntered += document.getElementById('otp-'+i).value;
            }

            if (codeEntered !== generatedCode) {
                alert("Código inválido! Tente novamente.");
                return;
            }

            btn.innerHTML = 'Processando Cadastro...';
            btn.style.opacity = '0.7';

            // DADOS FINALIZADOS - Envia para o Backend
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const plan = urlParams.get('plan') || 'trial-basic';
                const name = document.getElementById('name-input').value;
                const documentVal = document.getElementById('cpf-input').value;
                const email = document.getElementById('email-input').value;
                const password = document.getElementById('password-input').value;

                // 1. Criar a Conta no Backend (Lembre-se: o localhost so funciona se a API estiver rodando no mesmo pc)
                const authResponse = await fetch('http://localhost:3333/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storeName: name + ' Store',
                        userName: name,
                        document: documentVal,
                        email: email,
                        password: password,
                        plan: plan
                    })
                });

                const authData = await authResponse.json();

                if (!authResponse.ok) {
                    alert('Erro: ' + (authData.error || 'Não foi possível criar a conta.'));
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                    return;
                }

                localStorage.setItem('token', authData.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('tenantId', authData.tenant.id);

                if (plan.includes('trial')) {
                    alert('Conta de teste criada com sucesso! Você tem 7 dias grátis.');
                    window.location.href = 'area-cliente.html';
                } else {
                    btn.innerHTML = 'Gerando Pagamento Seguro...';
                    const payResponse = await fetch('http://localhost:3333/api/payments/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tenantId: authData.tenant.id,
                            plan: plan,
                            email: email
                        })
                    });
                    
                    const payData = await payResponse.json();
                    if (payData.init_point) {
                        window.location.href = payData.init_point;
                    } else {
                        alert('Erro ao gerar pagamento.');
                        window.location.href = 'area-cliente.html';
                    }
                }
            } catch (err) {
                console.error(err);
                alert('O seu cadastro foi validado, mas não foi possível conectar ao servidor (Backend) para finalizar. Se a API ainda não está hospedada, esse erro é esperado.');
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            }
        }
    </script>"""

script_pattern = re.compile(r'<script>.*?</script>', re.DOTALL)
content = script_pattern.sub(new_script, content)

with open('cadastro.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("cadastro.html updated successfully!")

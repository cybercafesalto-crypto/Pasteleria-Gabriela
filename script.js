// ======================================================
// Pastelería Artesanal Gabriela Alfonso 3.0
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // HEADER AL HACER SCROLL
    // ===========================

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.background = "rgba(255,255,255,.98)";
            header.style.boxShadow = "0 8px 25px rgba(0,0,0,.15)";

        } else {

            header.style.background = "rgba(255,255,255,.90)";
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,.08)";
        }

    });

    // ===========================
    // BOTÓN VOLVER ARRIBA
    // ===========================

    const btnTop = document.createElement("button");

    btnTop.id = "btnTop";
    btnTop.innerHTML = "↑";

    document.body.appendChild(btnTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            btnTop.style.display = "block";

        } else {

            btnTop.style.display = "none";

        }

    });

    btnTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    // ===========================
    // ANIMACIONES AL SCROLL
    // ===========================

    const elementos = document.querySelectorAll(
        ".card, .nosotros-img, .nosotros-texto, .grid-galeria img, .testimonio, .caracteristica"
    );

    const mostrar = () => {

        elementos.forEach((el) => {

            const posicion = el.getBoundingClientRect().top;

            const pantalla = window.innerHeight - 100;

            if (posicion < pantalla) {

                el.style.opacity = "1";
                el.style.transform = "translateY(0)";

            }

        });

    };

    elementos.forEach((el) => {

        el.style.opacity = "0";
        el.style.transform = "translateY(50px)";
        el.style.transition = "all .8s ease";

    });

    window.addEventListener("scroll", mostrar);

    mostrar();

    // ===========================
    // LIGHTBOX
    // ===========================

    const imagenes = document.querySelectorAll(".grid-galeria img");

    const lightbox = document.createElement("div");

    lightbox.style.position = "fixed";
    lightbox.style.top = "0";
    lightbox.style.left = "0";
    lightbox.style.width = "100%";
    lightbox.style.height = "100%";
    lightbox.style.background = "rgba(0,0,0,.9)";
    lightbox.style.display = "none";
    lightbox.style.justifyContent = "center";
    lightbox.style.alignItems = "center";
    lightbox.style.cursor = "zoom-out";
    lightbox.style.zIndex = "9999";

    const img = document.createElement("img");

    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.borderRadius = "15px";
    img.style.boxShadow = "0 20px 60px rgba(0,0,0,.5)";

    lightbox.appendChild(img);

    document.body.appendChild(lightbox);

    imagenes.forEach((foto) => {

        foto.addEventListener("click", () => {

            img.src = foto.src;

            lightbox.style.display = "flex";

        });

    });

    lightbox.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

    // ===========================
    // FORMULARIO DE CONTACTO
    // ===========================

    const formulario = document.getElementById("formularioContacto");
    const mensajeDiv = document.getElementById("mensajeEnvio");

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const asunto = document.getElementById("asunto").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();

            // Validar que los campos no estén vacíos
            if (!nombre || !email || !asunto || !mensaje) {
                mostrarMensaje("Por favor, completa todos los campos", "error");
                return;
            }

            // Validar email básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                mostrarMensaje("Por favor, ingresa un email válido", "error");
                return;
            }

            // Enviar por WhatsApp (opción 1 - más interactiva)
            const mensajeWhatsApp = `Hola Gabriela! Tengo una consulta:%0A%0A*Nombre:* ${nombre}%0A*Email:* ${email}%0A*Asunto:* ${asunto}%0A%0A*Mensaje:*%0A${mensaje}`;
            const urlWhatsApp = `https://wa.me/59898390007?text=${mensajeWhatsApp}`;

            // O enviar por email (opción 2)
            const urlEmail = `mailto:cybercafesalto@gmail.com?subject=${encodeURIComponent(asunto)}&body=Nombre: ${nombre}%0AEmail: ${email}%0A%0A${mensaje}`;

            // Mostrar opciones
            mostrarMensaje("✓ ¡Mensaje listo! Redirigiendo...", "exito");

            // Redirigir a WhatsApp después de 1 segundo
            setTimeout(() => {
                window.open(urlWhatsApp, "_blank");
                formulario.reset();
            }, 1000);
        });

        function mostrarMensaje(texto, tipo) {
            mensajeDiv.textContent = texto;
            mensajeDiv.className = `mensaje-envio ${tipo}`;
            
            if (tipo === "error") {
                setTimeout(() => {
                    mensajeDiv.textContent = "";
                }, 3000);
            }
        }
    }

    // ===========================
    // EFECTO DE TECLA ENTER
    // ===========================

    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && input.tagName !== "TEXTAREA") {
                formulario.dispatchEvent(new Event("submit"));
            }
        });
    });

});

// ----------------------------------------------------------------------
        // 2. BUSCADOR INTELIGENTE
        // ----------------------------------------------------------------------
        const searchInput = document.getElementById('searchInput');
        let originalHTML = {}; // Para restaurar el DOM original

        // Guardamos el contenido original de las áreas buscables
        const searchableElements = document.querySelectorAll('h2, h3, p, span, li');
        searchableElements.forEach((el, index) => {
            el.setAttribute('data-search-id', index);
            originalHTML[index] = el.innerHTML;
        });

        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            localStorage.setItem('scikidsSearchTerm', term);
            
            searchableElements.forEach(el => {
                const id = el.getAttribute('data-search-id');
                // Restaurar original primero
                el.innerHTML = originalHTML[id];

                if (term.length > 2) {
                    const text = el.textContent;
                    if (text.toLowerCase().includes(term)) {
                        const regex = new RegExp(`(${term})`, 'gi');
                        el.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
                    }
                }
            });
        });

        const previousSearch = localStorage.getItem('scikidsSearchTerm');
        if (previousSearch) {
            searchInput.value = previousSearch;
            searchInput.dispatchEvent(new Event('input'));
        }

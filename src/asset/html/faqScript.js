
        window.onload = () => {
            const allowMultipleActive = true;
            const blockShownCount = 5;
            const slideToggle = (block) => {
                const blockBody = block.querySelector('.cc-block-body');
                if (!blockBody || block.classList.contains('animating')) return;
                block.classList.add('animating');
                const computedStyle = getComputedStyle(blockBody);
                const transitionIsInMs = (computedStyle.transitionDuration.indexOf('ms') !== -1);
                const transitionDuration = (parseFloat(computedStyle.transitionDuration) * (transitionIsInMs ? 1000 : 1)) + 50;
                if (block.classList.contains('active')) {
                    // Close
                    blockBody.style.height = '';
                    blockBody.style.height = `${blockBody.clientHeight}px`;
                    setTimeout(() => blockBody.style.height = '0px', 0);
                    setTimeout(() => block.classList.remove('active'), transitionDuration);
                } else {
                    // Open
                    block.classList.add('active');
                    blockBody.style.height = 'auto';
                    const totalHeight = `${blockBody.clientHeight}px`;
                    blockBody.style.height = '0px';
                    setTimeout(() => blockBody.style.height = totalHeight, 0);
                }
                setTimeout(() => {
                    blockBody.style.height = '';
                    block.classList.remove('animating');
                }, transitionDuration);
            }
            document.querySelectorAll('.cameleon_content').forEach((section) => {
                const blocks = section.querySelectorAll('.cc-block');
                blocks.forEach((block, index) => {
                    const blockHead = block.querySelector('.cc-block-head');
                    if (!blockHead) return;
                    if (index >= blockShownCount) block.classList.add('hidden');
                    blockHead.addEventListener('click', (e) => {
                        if (blockHead.closest('.cc-block')?.classList.contains('animating')) return;
                        if (!allowMultipleActive) {
                            const blocks = Array.from(section.querySelectorAll('.cc-block.active')).filter((b) => b !== block);
                            blocks.forEach((activeBlock) => slideToggle(activeBlock));
                        }
                        slideToggle(block);
                    });
                });
                const showMoreBtn = section.querySelector('.cc-show_more');
                if (showMoreBtn) {
                    if (blocks.length > blockShownCount) showMoreBtn.classList.remove('hide');
                    showMoreBtn.addEventListener('click', (e) => {
                        const blocks = Array.from(section.querySelectorAll('.cc-block.hidden'));
                        if (blocks.length <= blockShownCount) e.currentTarget.classList.add('hide');
                        blocks.slice(0, blockShownCount).forEach((block) => block.classList.remove('hidden'));
                    });
                }
            });
        };

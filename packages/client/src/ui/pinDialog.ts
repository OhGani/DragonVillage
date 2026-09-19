/**
 * PIN 4자리 입력 창 (M5, #63). 로비 위에 뜬다. 취소하면 null.
 */
export function askPin(root: HTMLElement, title: string, sub: string, okLabel = '확인', cancelLabel: string | null = '다른 이름으로'): Promise<string | null> {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'overlay show pin-dialog';
    el.innerHTML = `
      <div class="overlay-card">
        <h1 class="overlay-title pin-title"></h1>
        <p class="overlay-sub pin-sub"></p>
        <input class="lobby-input pin-input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="숫자 4자리" />
        <p class="lobby-error pin-error" hidden></p>
        <button class="overlay-btn pin-ok"></button>
        <button class="overlay-help pin-cancel"></button>
      </div>`;
    el.querySelector('.pin-title')!.textContent = title;
    el.querySelector('.pin-sub')!.textContent = sub;
    const input = el.querySelector<HTMLInputElement>('.pin-input')!;
    const err = el.querySelector<HTMLElement>('.pin-error')!;
    const ok = el.querySelector<HTMLButtonElement>('.pin-ok')!;
    const cancel = el.querySelector<HTMLButtonElement>('.pin-cancel')!;
    ok.textContent = okLabel;
    if (cancelLabel) cancel.textContent = cancelLabel;
    else cancel.hidden = true;
    const done = (v: string | null) => {
      el.remove();
      resolve(v);
    };
    const submit = () => {
      const v = input.value.trim();
      if (!/^\d{4}$/.test(v)) {
        err.textContent = '숫자 4자리를 넣어 주세요';
        err.hidden = false;
        input.focus();
        return;
      }
      done(v);
    };
    ok.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    cancel.addEventListener('click', () => done(null));
    root.appendChild(el);
    setTimeout(() => input.focus(), 50);
  });
}

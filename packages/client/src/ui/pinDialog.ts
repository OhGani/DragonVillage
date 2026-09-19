/**
 * PIN 4자리 입력 창 (M5, #63). 로비 위에 뜬다. 취소하면 null.
 */
export function askPin(root: HTMLElement, title: string, sub: string, okLabel = '확인', cancelLabel: string | null = '다른 이름으로'): Promise<string | null> {
  return askInput(root, { title, sub, okLabel, cancelLabel, pattern: /^\d{4}$/, invalid: '숫자 4자리를 넣어 주세요', placeholder: '숫자 4자리', password: true, maxLength: 4 });
}

export interface AskInputOptions {
  title: string;
  sub: string;
  okLabel?: string;
  cancelLabel?: string | null;
  pattern: RegExp;
  invalid: string;
  placeholder: string;
  password?: boolean;
  maxLength?: number;
}

/** 짧은 입력 하나 (PIN·가족 코드). 취소하면 null */
export function askInput(root: HTMLElement, o: AskInputOptions): Promise<string | null> {
  const okLabel = o.okLabel ?? '확인';
  const cancelLabel = o.cancelLabel === undefined ? '취소' : o.cancelLabel;
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'overlay show pin-dialog';
    el.innerHTML = `
      <div class="overlay-card">
        <h1 class="overlay-title pin-title"></h1>
        <p class="overlay-sub pin-sub"></p>
        <input class="lobby-input pin-input" type="${o.password ? 'password' : 'text'}" inputmode="numeric" pattern="[0-9]*" maxlength="${o.maxLength ?? 12}" autocomplete="off" placeholder="${o.placeholder}" />
        <p class="lobby-error pin-error" hidden></p>
        <button class="overlay-btn pin-ok"></button>
        <button class="overlay-help pin-cancel"></button>
      </div>`;
    el.querySelector('.pin-title')!.textContent = o.title;
    el.querySelector('.pin-sub')!.textContent = o.sub;
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
      if (!o.pattern.test(v)) {
        err.textContent = o.invalid;
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

(() => {
  const normalize = (text = '') =>
    text
      .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const normalizeMultiline = (text = '') =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const toJapaneseDate = (raw = '') => {
    if (!raw) return '';

    const normalized = raw.trim();
    const ymd = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (ymd) {
      const [, y, m, d] = ymd;
      return `${y}年${m.padStart(2, '0')}月${d.padStart(2, '0')}日`;
    }

    const jp = normalized.match(/^(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日$/);
    if (jp) {
      const [, y, m, d] = jp;
      return `${y}年${m.padStart(2, '0')}月${d.padStart(2, '0')}日`;
    }

    return normalized;
  };

  const findConditionValue = (name) => {
    const conditions = [...document.querySelectorAll('.bl_request-condition')];
    const matched = conditions.find((condition) => {
      const label = condition.querySelector('.request-condition-name');
      return label && normalize(label.textContent) === name;
    });

    if (!matched) return '';

    const valueNode = matched.querySelector('.request-condition-value');
    return normalize(valueNode?.textContent || '');
  };

  const requester =
    normalize(document.querySelector('.request-detail-user > a')?.textContent || '') ||
    normalize(document.querySelector('.offer-user-name')?.textContent || '');

  const budget = findConditionValue('予算').replace(/[円,\s]/g, '');
  const categoryItems = [...document.querySelectorAll('.request-condition-categories-item')]
    .map((el) => normalize(el.textContent))
    .filter(Boolean);
  const category = categoryItems.length > 1 ? `${categoryItems[0]}（以下省略）` : (categoryItems[0] || '');

  const proposalTitle =
    normalize(document.querySelector('#RequestTitle')?.value || '') ||
    normalize(document.querySelector('.request-detail-title')?.textContent || '');

  const proposalContent = normalizeMultiline(document.querySelector('#OfferContent')?.value || '');

  const attachmentNames = [...document.querySelectorAll('.js_upload-file-name')]
    .map((el) => normalize(el.textContent))
    .filter((name) => name && name !== '選択されていません');

  const checkedPlanInput = document.querySelector('input[name="data[Offer][is_subscription]"]:checked');
  const purchasePlan = checkedPlanInput
    ? normalize(document.querySelector(`label[for="${checkedPlanInput.id}"]`)?.textContent || '')
    : findConditionValue('購入プラン');

  const offerPrice = (document.querySelector('#OfferPrice')?.value || '').replace(/,/g, '').trim();

  const unitTimeSelect = document.querySelector('#OfferUnitTime');
  const serviceUnitTime = (() => {
    if (!unitTimeSelect || !unitTimeSelect.value) return '';
    const selected = unitTimeSelect.selectedOptions?.[0];
    const label = normalize(selected?.textContent || '');
    return label === '選択' ? '' : label;
  })();

  const completionDateRaw =
    document.querySelector('#OfferExpireDate')?.dataset.value ||
    document.querySelector('#OfferExpireDate')?.value ||
    '';

  const result = {
    依頼者: requester,
    予算: budget,
    提案期限: findConditionValue('提案期限'),
    納品希望日: findConditionValue('納品希望日'),
    サービス名: findConditionValue('サービス名'),
    カテゴリ: category,
    提案タイトル: proposalTitle,
    提案内容: proposalContent,
    添付ファイル: attachmentNames,
    購入プラン: purchasePlan,
    提案額設定: offerPrice,
    サービスの提供時間: serviceUnitTime,
    完了予定日: toJapaneseDate(completionDateRaw),
  };

  console.log(result);
  console.log(JSON.stringify(result, null, 2));
})();

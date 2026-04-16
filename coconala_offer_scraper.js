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

  const findGroupByTitle = (title) => {
    const groups = [...document.querySelectorAll('.bl_form-group.offer-form-group')];
    return groups.find((group) => {
      const heading = group.querySelector('.form-title');
      return heading && normalize(heading.textContent).startsWith(title);
    }) || null;
  };

  const requester = normalize(document.querySelector('.offer-user-name')?.textContent || '');

  const serviceName = normalize(
    findGroupByTitle('サービス名')?.querySelector('.form-input')?.textContent || ''
  );

  const categoryGroup = findGroupByTitle('カテゴリ');
  const categoryParts = categoryGroup
    ? [...categoryGroup.querySelectorAll('.base-category span')]
        .map((el) => normalize(el.textContent))
        .filter((t) => t && t !== '>')
    : [];
  const category = categoryParts.join(' > ');

  const proposalTitle = normalize(document.querySelector('#RequestTitle')?.value || '');
  const proposalContent = normalizeMultiline(document.querySelector('#OfferContent')?.value || '');

  const attachmentNames = [...document.querySelectorAll('.js_upload-file-name')]
    .map((el) => normalize(el.textContent))
    .filter((name) => name && name !== '選択されていません');

  const checkedPlanInput = document.querySelector('input[name="data[Offer][is_subscription]"]:checked');
  const purchasePlan = checkedPlanInput
    ? normalize(document.querySelector(`label[for="${checkedPlanInput.id}"]`)?.textContent || '')
    : '';

  const offerPrice = (document.querySelector('#OfferPrice')?.value || '').replace(/,/g, '').trim();

  const rawDate = document.querySelector('#OfferExpireDate')?.value?.trim() || '';
  const completionDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    ? rawDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日')
    : rawDate;

  const result = {
    依頼者: requester,
    サービス名: serviceName,
    カテゴリ: category,
    提案タイトル: proposalTitle,
    提案内容: proposalContent,
    添付ファイル: attachmentNames,
    購入プラン: purchasePlan,
    提案額設定: offerPrice,
    完了予定日: completionDate,
  };

  console.log(result);
  console.log(JSON.stringify(result, null, 2));
})();

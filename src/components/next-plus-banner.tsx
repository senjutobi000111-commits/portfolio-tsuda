// NEXT+ 紹介バナー（フッター最下部に "追加" するだけ。既存デザイン・レイアウトは変更しない）
// 中央寄せ・最大幅520px・はみ出し防止（width:100% + maxWidth + margin auto）。
export const NextPlusBanner = () => {
  return (
    <div className="w-full">
      <iframe
        src="https://nextplus.link/embed/qHkhSwpxPrR1MTLAALok6fH4kKebTSMk?theme=light&design=coupon"
        title="NEXT+ 近くのお得"
        loading="lazy"
        style={{
          width: "100%",
          maxWidth: "520px",
          aspectRatio: "520/162",
          border: 0,
          display: "block",
          margin: "24px auto 0",
        }}
      />
    </div>
  );
};

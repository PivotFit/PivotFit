// Shown after we send an email. Our mail goes out through a Gmail account, so
// it often lands in spam, especially the first one.
function SpamFolderNote() {
  return (
    <p className="form-note spam-note">
      <strong>Don't see it?</strong> Check your spam or junk folder. It can
      take a few minutes to arrive. If you find it there, mark it as "Not
      spam" so future emails from PivotFit reach your inbox.
    </p>
  );
}

export default SpamFolderNote;

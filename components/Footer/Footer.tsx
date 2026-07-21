import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Oleksandr Verba</p>
          <p>
            Contact us:
            <a href="mailto:verba-tim@outlook.com">verba-tim@outlook.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

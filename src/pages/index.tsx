import React, { ReactElement } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home(): ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Classics from the bug hole"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Explore</h2>
        <div className={styles.cardGrid}>
          <Link className={styles.card} to="/recipes">
            <h3>🍽️ Recipes</h3>
            <p>Explore delicious recipes from the bug hole classics.</p>
          </Link>
          <Link className={styles.card} to="/cocktails">
            <h3>🍸 Cocktails</h3>
            <p>Discover cocktail recipes and mixology magic.</p>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
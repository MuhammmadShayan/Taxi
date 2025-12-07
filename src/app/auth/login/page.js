'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import WorkingLoginForm from '../../../components/WorkingLoginForm';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <section className="breadcrumb-area bread-bg-9">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Login</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/">Home</Link></li>
                    <li>Account</li>
                    <li>Login</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bread-svg-box">
          <svg className="bread-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
            <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
          </svg>
        </div>
      </section>

      {/* Login Section */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="form-box">
                <div className="form-title-wrap text-center">
                  <h3 className="title">Sign in to your account</h3>
                  <p className="text-muted">Welcome back! Please enter your credentials.</p>
                </div>

                {message && (
                  <div className="alert alert-success" role="alert">
                    <i className="la la-check-circle me-2" aria-hidden="true"></i>
                    {message}
                  </div>
                )}

                <div className="form-content">
                  <WorkingLoginForm />

                  <div className="text-center mt-3">
                    <p className="mb-1">
                      <Link href="/auth/forgot-password" className="text-primary">Forgot Password?</Link>
                    </p>
                    <p className="text-muted">
                      Don&apos;t have an account?
                      <Link href="/register" className="text-decoration-none ms-1">Create one</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginPageContent />
    </Suspense>
  );
}
export const dynamic = 'force-dynamic';

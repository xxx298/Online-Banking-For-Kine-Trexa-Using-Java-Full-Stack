import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)

def build_pdf():
    pdf_filename = os.path.join(os.path.dirname(__file__), "Project_Report.pdf")
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1e3a8a")   # Deep navy
    c_secondary = colors.HexColor("#3b82f6") # Bright blue
    c_accent = colors.HexColor("#10b981")    # Emerald green
    c_dark = colors.HexColor("#0f172a")      # Slate dark
    c_light_bg = colors.HexColor("#f8fafc")  # Light gray background

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        alignment=0,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Title Banner
    story.append(Paragraph("AuraBank - Secure Online Banking System", title_style))
    story.append(Paragraph("Software Architecture & Technical Implementation Report | Deliverable Task 2", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_secondary, spaceAfter=15))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    exec_summary_text = (
        "The <b>Secure Online Banking System (AuraBank)</b> is a full-stack, enterprise-ready web application "
        "engineered to facilitate secure user authentication, multi-account portfolio management, atomic fund transfers, "
        "filterable transaction history, digital receipt exporting, and administrative role-based risk oversight. "
        "Built using Node.js/Express, SQLite3, and React 18, the system implements bank-grade security protocols "
        "including bcrypt password/PIN hashing, JWT stateless authorization, CORS protections, and real-time security audit logging."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 10))

    # System Key Features Table
    story.append(Paragraph("<b>Core Feature Breakdown</b>", body_style))
    features_data = [
        [Paragraph("<b>Feature</b>", body_style), Paragraph("<b>Technical Details</b>", body_style), Paragraph("<b>Security / User Value</b>", body_style)],
        [Paragraph("Secure Login & Registration", body_style), Paragraph("JWT Bearer tokens, Bcrypt hash (10 salt rounds)", body_style), Paragraph("Prevents credential leakage; automated welcome credit.", body_style)],
        [Paragraph("Account Management", body_style), Paragraph("Checking, Savings (4.5% APY), Investment", body_style), Paragraph("Instant account creation & instant freeze/unfreeze action.", body_style)],
        [Paragraph("Fund Transfer Engine", body_style), Paragraph("2-Factor 4-Digit Security PIN validation", body_style), Paragraph("Atomic money transfers with zero balance vulnerability.", body_style)],
        [Paragraph("Transaction History", body_style), Paragraph("Real-time search, category filters, receipt export", body_style), Paragraph("Searchable audit trail & printable digital receipts.", body_style)],
        [Paragraph("Role-Based Access Control", body_style), Paragraph("Admin Portal & Audit Log Stream", body_style), Paragraph("Enables system liquidity monitoring & user account freeze.", body_style)],
    ]
    t_features = Table(features_data, colWidths=[1.8*inch, 2.7*inch, 2.5*inch])
    t_features.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_light_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), c_primary),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_features)
    story.append(Spacer(1, 14))

    # 2. Architectural Overview
    story.append(Paragraph("2. System Architecture & Tech Stack", h1_style))
    tech_stack_text = (
        "The architecture strictly adheres to modern full-stack decoupling principle with a RESTful backend API and "
        "a reactive Vite single-page application (SPA)."
    )
    story.append(Paragraph(tech_stack_text, body_style))

    arch_data = [
        [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology Stack</b>", body_style), Paragraph("<b>Purpose</b>", body_style)],
        [Paragraph("Frontend", body_style), Paragraph("React 18, Vite, Vanilla CSS, Recharts", body_style), Paragraph("Responsive glassmorphic financial portal.", body_style)],
        [Paragraph("Backend API", body_style), Paragraph("Node.js, Express.js, JWT, BcryptJS", body_style), Paragraph("RESTful controllers, input validation & auth.", body_style)],
        [Paragraph("Database", body_style), Paragraph("SQLite3 (`online_banking.db`)", body_style), Paragraph("Relational integrity with FK foreign key constraints.", body_style)],
        [Paragraph("PDF Report Engine", body_style), Paragraph("Python 3.13, ReportLab Framework", body_style), Paragraph("Automated generation of formal project documentation.", body_style)]
    ]
    t_arch = Table(arch_data, colWidths=[1.5*inch, 2.5*inch, 3.0*inch])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_light_bg),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 14))

    # 3. Database Schema Overview
    story.append(Paragraph("3. Database Entity-Relationship & Schema Design", h1_style))
    db_text = (
        "The SQLite database is structured around 5 core tables ensuring strict normalization and foreign key integrity:"
    )
    story.append(Paragraph(db_text, body_style))

    story.append(Paragraph("• <b>users</b>: <code>id, full_name, email, password_hash, transaction_pin, role, status, created_at</code>", bullet_style))
    story.append(Paragraph("• <b>accounts</b>: <code>id, user_id, account_number, account_type, balance, status, created_at</code>", bullet_style))
    story.append(Paragraph("• <b>transactions</b>: <code>id, reference_id, sender_account_id, receiver_account_id, amount, category, description, status, created_at</code>", bullet_style))
    story.append(Paragraph("• <b>beneficiaries</b>: <code>id, user_id, beneficiary_account_number, beneficiary_name, nickname, created_at</code>", bullet_style))
    story.append(Paragraph("• <b>audit_logs</b>: <code>id, user_id, action, ip_address, details, created_at</code>", bullet_style))
    story.append(Spacer(1, 14))

    # Page Break for clean presentation
    story.append(PageBreak())

    # 4. REST API Endpoint Specifications
    story.append(Paragraph("4. REST API Endpoint Reference", h1_style))
    
    api_data = [
        [Paragraph("<b>HTTP Method</b>", body_style), Paragraph("<b>Endpoint Path</b>", body_style), Paragraph("<b>Access Level</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/auth/register</code>", code_style), Paragraph("Public", body_style), Paragraph("Registers user & creates $1,000 checking account.", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/auth/login</code>", code_style), Paragraph("Public", body_style), Paragraph("Validates credentials & returns JWT token.", body_style)],
        [Paragraph("GET", body_style), Paragraph("<code>/api/accounts</code>", code_style), Paragraph("Customer", body_style), Paragraph("Fetches user accounts and total balance.", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/accounts</code>", code_style), Paragraph("Customer", body_style), Paragraph("Opens savings/checking/investment account.", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/transfers</code>", code_style), Paragraph("Customer", body_style), Paragraph("Atomic money transfer with 4-digit PIN verification.", body_style)],
        [Paragraph("GET", body_style), Paragraph("<code>/api/transactions</code>", code_style), Paragraph("Customer", body_style), Paragraph("Filterable transaction history with search.", body_style)],
        [Paragraph("GET", body_style), Paragraph("<code>/api/admin/analytics</code>", code_style), Paragraph("Admin Only", body_style), Paragraph("System liquidity, transfer volume & audit logs.", body_style)],
        [Paragraph("PATCH", body_style), Paragraph("<code>/api/admin/users/:id/status</code>", code_style), Paragraph("Admin Only", body_style), Paragraph("Freezes or activates user access.", body_style)]
    ]
    t_api = Table(api_data, colWidths=[1.1*inch, 2.3*inch, 1.1*inch, 2.5*inch])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_light_bg),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 14))

    # 5. Security & Risk Analysis
    story.append(Paragraph("5. Security Controls & Defensive Engineering", h1_style))
    security_text = (
        "AuraBank incorporates multiple layers of security to safeguard client capital and sensitive identity records:"
    )
    story.append(Paragraph(security_text, body_style))

    story.append(Paragraph("<b>1. Password & PIN Protection</b>: All user passwords and 4-digit transaction authorization PINs are salted and hashed using Bcrypt before disk persistence.", body_style))
    story.append(Paragraph("<b>2. Stateless Session Enforcement</b>: JWT tokens signed with a secret key expire after 24 hours. Token signatures are validated on every protected API call.", body_style))
    story.append(Paragraph("<b>3. Atomic Balance Verification</b>: Fund transfer controller guarantees sender balance sufficiency and updates both sender and recipient accounts within an atomic execution block.", body_style))
    story.append(Paragraph("<b>4. SQL Injection & XSS Prevention</b>: All database queries utilize parameterized SQL statements. Input fields strip malicious scripts.", body_style))
    story.append(Paragraph("<b>5. Immutable Audit Trail</b>: Sensitive operations (login, transfer, status freeze) write IP address and action details directly to <code>audit_logs</code>.", body_style))
    story.append(Spacer(1, 14))

    # 6. Deliverables & Verification Matrix
    story.append(Paragraph("6. Project Deliverables Matrix", h1_style))
    
    deliv_data = [
        [Paragraph("<b>Required Deliverable</b>", body_style), Paragraph("<b>Status</b>", body_style), Paragraph("<b>Artifact Location</b>", body_style)],
        [Paragraph("Public GitHub Repository", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("Root Directory Structure", body_style)],
        [Paragraph("Full Application Source Code", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("<code>/backend</code> & <code>/frontend</code>", body_style)],
        [Paragraph("README Documentation", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("<code>/README.md</code>", body_style)],
        [Paragraph("Database Schema (DDL)", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("<code>/docs/schema.sql</code>", body_style)],
        [Paragraph("API Documentation", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("<code>/docs/api_documentation.md</code>", body_style)],
        [Paragraph("Project Report (PDF)", body_style), Paragraph("<font color='#10b981'><b>COMPLETED</b></font>", body_style), Paragraph("<code>/docs/Project_Report.pdf</code>", body_style)]
    ]
    t_deliv = Table(deliv_data, colWidths=[2.2*inch, 1.8*inch, 3.0*inch])
    t_deliv.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_light_bg),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_deliv)

    doc.build(story)
    print("Project_Report.pdf successfully generated at:", pdf_filename)

if __name__ == "__main__":
    build_pdf()

#!/usr/bin/env python3
"""
Quick Personal Information Audit
Scans MCP server files for personal identifiers
Run this BEFORE full sanitization to get audit report
"""

import re
import sys
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

class PersonalInfoAuditor:
    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.findings: Dict[str, List[Tuple[Path, int, str]]] = defaultdict(list)

        # Define what we're looking for
        self.patterns = {
            'CRITICAL - Pirate username': r'\b[Pp]irate\b',
            'HIGH - Jason Glass name': r'\b[Jj]ason\s+Glass\b',
            'HIGH - Jason standalone': r'\b[Jj]ason\b(?!\s+Glass)',
            'HIGH - Nova standalone': r'\bNova\b(?!-\w+)',
            'MEDIUM - Basement revolution': r'basement\s+revolution',
            'MEDIUM - FUCK THE CONTROL': r'FUCK\s+THE\s+CONTROL',
            'LOW - Purple heart emoji': r'💜|:purple_heart:',
            'CRITICAL - Hardcoded Pirate path': r'C:\\\\Users\\\\Pirate|/Users/Pirate',
            'CRITICAL - NOVA_MASTER path': r'Desktop[/\\\\]NOVA_MASTER',
            'HIGH - Workspace path': r'CONSCIOUSNESS_DASHBOARD\.code-workspace',
            'MEDIUM - Port 9997': r'9997',
            'LOW - 21.43Hz frequency': r'21\.43',
        }

        # File extensions to scan
        self.extensions = {'.js', '.py', '.md', '.json', '.txt'}

    def scan_file(self, file_path: Path):
        """Scan a single file for personal information"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"[ERROR] Could not read {file_path}: {e}")
            return

        for line_num, line in enumerate(lines, 1):
            for category, pattern in self.patterns.items():
                matches = re.finditer(pattern, line, re.IGNORECASE)
                for match in matches:
                    # Store relative path for cleaner output
                    rel_path = file_path.relative_to(self.base_path)
                    self.findings[category].append((
                        rel_path,
                        line_num,
                        line.strip()[:80]  # First 80 chars
                    ))

    def scan_directory(self, directory: Path):
        """Recursively scan directory"""
        for item in directory.rglob('*'):
            # Skip node_modules and .git
            if any(part in {'node_modules', '.git', '__pycache__'} for part in item.parts):
                continue

            if item.is_file() and item.suffix in self.extensions:
                self.scan_file(item)

    def generate_report(self) -> str:
        """Generate formatted audit report"""
        report = []
        report.append("=" * 80)
        report.append("MCP SERVER PERSONAL INFORMATION AUDIT REPORT")
        report.append("=" * 80)
        report.append(f"\nScanned: {self.base_path}")
        report.append(f"Timestamp: {self._get_timestamp()}\n")

        if not self.findings:
            report.append("[OK] No personal information found!")
            return '\n'.join(report)

        # Count total findings
        total = sum(len(items) for items in self.findings.values())
        report.append(f"[WARN] Found {total} instances across {len(self.findings)} categories\n")

        # Sort by severity
        severity_order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

        for severity in severity_order:
            severity_findings = {
                cat: items for cat, items in self.findings.items()
                if cat.startswith(severity)
            }

            if not severity_findings:
                continue

            report.append(f"\n{'=' * 80}")
            report.append(f"{severity} PRIORITY")
            report.append('=' * 80)

            for category, items in sorted(severity_findings.items()):
                report.append(f"\n{category}: {len(items)} instances")
                report.append('-' * 80)

                # Group by file
                by_file = defaultdict(list)
                for file_path, line_num, line_content in items:
                    by_file[file_path].append((line_num, line_content))

                for file_path in sorted(by_file.keys()):
                    occurrences = by_file[file_path]
                    report.append(f"\n  File: {file_path} ({len(occurrences)} occurrences)")

                    # Show first 3 occurrences per file
                    for line_num, line_content in occurrences[:3]:
                        report.append(f"    Line {line_num}: {line_content}")

                    if len(occurrences) > 3:
                        report.append(f"    ... and {len(occurrences) - 3} more")

        # Summary statistics
        report.append("\n" + "=" * 80)
        report.append("SUMMARY STATISTICS")
        report.append("=" * 80)

        files_affected = set()
        for items in self.findings.values():
            for file_path, _, _ in items:
                files_affected.add(file_path)

        report.append(f"\nTotal findings: {total}")
        report.append(f"Files affected: {len(files_affected)}")
        report.append(f"Categories: {len(self.findings)}")

        # Critical items that MUST be fixed
        critical_count = sum(
            len(items) for cat, items in self.findings.items()
            if cat.startswith('CRITICAL')
        )

        if critical_count > 0:
            report.append(f"\n[CRITICAL] {critical_count} items MUST be removed before release")

        return '\n'.join(report)

    def generate_file_list(self) -> List[Path]:
        """Generate list of files that need sanitization"""
        files_affected = set()
        for items in self.findings.values():
            for file_path, _, _ in items:
                files_affected.add(file_path)
        return sorted(files_affected)

    def _get_timestamp(self):
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    # Force UTF-8 output for Windows console
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

    # Determine base path
    if len(sys.argv) > 1:
        base_path = Path(sys.argv[1])
    else:
        # Default to MCP_EXTENSIONS directory
        base_path = Path(__file__).parent.parent / 'MCP_EXTENSIONS'

    if not base_path.exists():
        print(f"Error: Path does not exist: {base_path}")
        sys.exit(1)

    print(f"Scanning: {base_path.absolute()}\n")

    # Run audit
    auditor = PersonalInfoAuditor(base_path)
    auditor.scan_directory(base_path)

    # Generate and print report
    report = auditor.generate_report()
    print(report)

    # Save report to file
    report_path = Path(__file__).parent / 'AUDIT_REPORT.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"\n\n[OK] Report saved to: {report_path}")

    # Generate file list
    files_affected = auditor.generate_file_list()
    if files_affected:
        print(f"\n\nFiles requiring sanitization ({len(files_affected)}):")
        for file_path in files_affected:
            print(f"  - {file_path}")

        # Save file list
        filelist_path = Path(__file__).parent / 'FILES_TO_SANITIZE.txt'
        with open(filelist_path, 'w', encoding='utf-8') as f:
            for file_path in files_affected:
                f.write(f"{file_path}\n")
        print(f"\n[OK] File list saved to: {filelist_path}")

    # Exit with error code if critical findings
    critical_count = sum(
        len(items) for cat, items in auditor.findings.items()
        if cat.startswith('CRITICAL')
    )

    if critical_count > 0:
        print(f"\n\n[CRITICAL] RELEASE BLOCKED: {critical_count} CRITICAL items must be fixed")
        sys.exit(1)
    else:
        print("\n\n[OK] No critical blockers (but review HIGH/MEDIUM items)")
        sys.exit(0)


if __name__ == '__main__':
    main()

"""导出服务 — 知识库笔记导出为 Markdown / PDF / HTML"""
from typing import Literal
from ..models.knowledge import KnowledgeEntry


class ExportService:
    @staticmethod
    def to_markdown(entries: list[KnowledgeEntry]) -> str:
        """导出为 Markdown"""
        lines = [
            "# 知源 · 知识库导出",
            f"> 导出时间：{entries[0].saved_at[:10] if entries else '—'}  |  共 {len(entries)} 条笔记",
            "",
            "---",
            "",
        ]
        for i, e in enumerate(entries, 1):
            lines.append(f"## {i}. {e.material_title}")
            lines.append("")
            if e.tags:
                lines.append(f"**标签**：{' · '.join('#' + t for t in e.tags)}")
                lines.append("")
            lines.append("### 核心逻辑链")
            lines.append("")
            lines.append(e.logic_chain)
            lines.append("")
            if e.key_concepts:
                lines.append("### 关键概念")
                lines.append("")
                for c in e.key_concepts:
                    lines.append(f"- **{c.term}**：{c.definition}")
                lines.append("")
            if e.extension_questions:
                lines.append("### 延伸思考")
                lines.append("")
                for q in e.extension_questions:
                    lines.append(f"- {q}")
                lines.append("")
            if e.cards:
                lines.append("### 问答卡片")
                lines.append("")
                for c in e.cards:
                    lines.append(f"- **Q**：{c.question}")
                    lines.append(f"  **A**：{c.answer}")
                lines.append("")
            if e.reflection_zone:
                lines.append("### 我的理解")
                lines.append("")
                lines.append(e.reflection_zone)
                lines.append("")
            lines.append("---")
            lines.append("")
        return "\n".join(lines)

    @staticmethod
    def to_html(entries: list[KnowledgeEntry]) -> str:
        """导出为自包含 HTML"""
        md = ExportService.to_markdown(entries)
        return f"""<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<title>知源 · 知识库导出</title>
<style>body{{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1A1512;background:#F9F6F0;line-height:1.8}}h1{{font-family:Georgia,serif}}h2{{font-family:Georgia,serif;margin-top:40px;padding-top:20px;border-top:1px solid #E8E1D4}}blockquote{{color:#8A7E70;border-left:3px solid #C0774E;padding-left:16px}}strong{{color:#C0774E}}ul{{padding-left:20px}}li{{margin-bottom:8px}}</style></head><body>
{ExportService._md_to_html(md)}
</body></html>"""

    @staticmethod
    def _md_to_html(md: str) -> str:
        """简易 Markdown → HTML（MVP版，后续可用 mistune/markdown 库）"""
        import re
        html = md
        html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        html = re.sub(r'^> (.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
        html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'^---$', r'<hr>', html, flags=re.MULTILINE)
        html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
        html = re.sub(r'(<li>.*</li>\n?)+', r'<ul>\g<0></ul>', html)
        html = re.sub(r'^(\d+)\. (.+)$', r'<li>\2</li>', html, flags=re.MULTILINE)
        return f'<div class="content">\n{html}\n</div>'

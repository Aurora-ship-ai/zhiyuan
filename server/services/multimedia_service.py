"""多类型资料搜索 — 视频/播客/音频"""
import ssl, json
import urllib.request as ur
import urllib.parse as up

_CTX = ssl.create_default_context()
_CTX.check_hostname = False
_CTX.verify_mode = ssl.CERT_NONE
_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

class BilibiliProvider:
    """B站视频搜索 — 免费，无需 API Key"""
    BASE = "https://api.bilibili.com/x/web-interface/search/type"

    def search(self, query: str, page_size: int = 10) -> list[dict]:
        results = []
        try:
            params = up.urlencode({
                "search_type": "video",
                "keyword": query,
                "page": 1,
            })
            req = ur.Request(f"{self.BASE}?{params}", headers={"User-Agent": _UA, "Referer": "https://www.bilibili.com"})
            r = ur.urlopen(req, timeout=10, context=_CTX)
            data = json.loads(r.read().decode("utf-8"))
            
            for item in data.get("data", {}).get("result", [])[:page_size]:
                results.append({
                    "title": item.get("title", "").replace('<em class="keyword">', "").replace("</em>", ""),
                    "url": f"https://www.bilibili.com/video/{item.get('bvid', '')}",
                    "content": item.get("description", ""),
                    "source": "B站",
                    "source_type": "video",
                    "score": min(9.0, 5.0 + (item.get("play", 0) / 100000)),
                    "extra": {
                        "duration": item.get("duration", ""),
                        "play_count": item.get("play", 0),
                        "author": item.get("author", ""),
                        "thumbnail": item.get("pic", ""),
                        "bvid": item.get("bvid", ""),
                    },
                    "tags": [t for t in item.get("tag", "").split(",") if t][:5],
                })
        except Exception as e:
            pass
        return results


class iTunesPodcastProvider:
    """iTunes 播客搜索 — 免费，无需 API Key"""
    BASE = "https://itunes.apple.com/search"

    def search(self, query: str, page_size: int = 10) -> list[dict]:
        results = []
        try:
            params = up.urlencode({
                "term": query,
                "media": "podcast",
                "limit": page_size,
                "country": "CN",
            })
            req = ur.Request(f"{self.BASE}?{params}", headers={"User-Agent": _UA})
            r = ur.urlopen(req, timeout=10, context=_CTX)
            data = json.loads(r.read().decode("utf-8"))
            
            for item in data.get("results", []):
                results.append({
                    "title": item.get("trackName", item.get("collectionName", "")),
                    "url": item.get("trackViewUrl", item.get("collectionViewUrl", "")),
                    "content": item.get("description", item.get("primaryGenreName", "")),
                    "source": "Apple Podcasts",
                    "source_type": "podcast",
                    "score": 6.0,
                    "extra": {
                        "episode_count": item.get("trackCount", 0),
                        "genre": item.get("primaryGenreName", ""),
                        "artwork": item.get("artworkUrl600", item.get("artworkUrl100", "")),
                        "artist": item.get("artistName", ""),
                    },
                    "tags": [item.get("primaryGenreName", "")] if item.get("primaryGenreName") else [],
                })
        except Exception as e:
            pass
        return results


class MultimediaService:
    def __init__(self):
        self.bilibili = BilibiliProvider()
        self.podcast = iTunesPodcastProvider()

    def search(self, query: str, source_type: str = "all", page_size: int = 10) -> list[dict]:
        results = []
        if source_type in ("all", "video"):
            results.extend(self.bilibili.search(query, page_size))
        if source_type in ("all", "podcast"):
            results.extend(self.podcast.search(query, page_size))
        # 按分数排序
        results.sort(key=lambda x: x.get("score", 0), reverse=True)
        return results[:page_size]

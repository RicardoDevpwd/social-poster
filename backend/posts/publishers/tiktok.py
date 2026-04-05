"""
TikTok Content Posting API publisher.
Documentação: https://developers.tiktok.com/doc/content-posting-api-get-started
Requer: access_token com escopo video.upload ou photo.upload.
"""
import requests


def publish(social_account, text: str, image_path: str | None) -> dict:
    token = social_account.access_token

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json; charset=UTF-8",
    }

    if image_path:
        # Inicializar upload de foto (Photo Post)
        init_resp = requests.post(
            "https://open.tiktokapis.com/v2/post/publish/content/init/",
            headers=headers,
            json={
                "post_info": {
                    "title": text[:2200],
                    "privacy_level": "SELF_ONLY",
                    "disable_duet": False,
                    "disable_comment": False,
                    "disable_stitch": False,
                },
                "source_info": {
                    "source": "FILE_UPLOAD",
                    "video_size": 0,
                    "chunk_size": 0,
                    "total_chunk_count": 1,
                },
            },
        )
        init_resp.raise_for_status()
        init_data = init_resp.json()
        publish_id = init_data["data"]["publish_id"]
        upload_url = init_data["data"]["upload_url"]

        with open(image_path, "rb") as f:
            file_data = f.read()

        upload_resp = requests.put(
            upload_url,
            headers={
                "Content-Range": f"bytes 0-{len(file_data) - 1}/{len(file_data)}",
                "Content-Type": "video/mp4",
            },
            data=file_data,
        )
        upload_resp.raise_for_status()
        return {"publish_id": publish_id}
    else:
        raise ValueError("TikTok requer arquivo de mídia (imagem/vídeo) para publicar.")

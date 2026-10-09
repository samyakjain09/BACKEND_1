import requests
from PIL import Image
from io import BytesIO

url = "https://takeuforward-content-images.s3.ap-south-1.amazonaws.com/profile/samyakjainn?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Checksum-Mode=ENABLED&X-Amz-Credential=AKIA2LFMBNFQHZGEYE7P%2F20261009%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261009T120045Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&x-id=GetObject&X-Amz-Signature=37817a32054fc2e6175442b0c3cef5cbe0e08d1acb20011978d929b7611d63b1"

response = requests.get(url)
response.raise_for_status()

image = Image.open(BytesIO(response.content))

print("Format:", image.format)
print("Dimensions:", image.size)
print("File size:", len(response.content), "bytes")
print("Metadata:", image.info)
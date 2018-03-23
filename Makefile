image_name = archapi
pwd = $(shell pwd)

all: dev
	sudo docker run \
		--network host \
		-it \
		$(image_name)

dev: cleanContainer
	sudo docker build \
		--network host \
		--tag $(image_name) \
		.

cleanContainer:
	sudo docker container prune -f

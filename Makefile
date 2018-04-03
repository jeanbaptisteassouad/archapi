image_name = archapi
pwd = $(shell pwd)

all: dev
	sudo docker run \
		--network host \
		--mount type=bind,source=$(pwd)/dummySecret,target=/run/secrets/archapiJwt,readonly \
		-it \
		$(image_name)

dev: cleanContainer
	sudo docker build \
		--network host \
		--tag $(image_name) \
		.

cleanContainer:
	sudo docker container prune -f


start:
	sudo docker run \
		--rm \
		-d \
		--name $(image_name)_elastic \
		--network host \
		-p 9200:9200 \
		-p 9300:9300 \
		-e "discovery.type=single-node" \
		docker.elastic.co/elasticsearch/elasticsearch:6.2.3

stop:
	sudo docker container kill $(image_name)_elastic
	sudo docker container prune -f
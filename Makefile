DENO?=deno
SUPABASE?=supabase
FUNCTIONS:=hello-world webhook-handler

.PHONY: fmt fmt-check lint test ci serve-hello-world serve-webhook deploy

fmt:
	$(DENO) fmt supabase/functions

fmt-check:
	$(DENO) fmt --check supabase/functions

lint:
	$(DENO) lint supabase/functions

test:
	$(DENO) test supabase/functions

ci: fmt-check lint test

serve-hello-world:
	$(SUPABASE) functions serve hello-world --env-file .env

serve-webhook:
	$(SUPABASE) functions serve webhook-handler --env-file .env

deploy:
	$(SUPABASE) functions deploy $(FUNCTIONS) --project-ref $$SUPABASE_PROJECT_REF

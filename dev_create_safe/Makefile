def:
	@echo - make deploy
	@echo - make transact

deploy:
	npx ts-node ./deploy_safe.ts

transact:
	npx ts-node ./transact.ts

addmodule:
	npx ts-node ./add_module.ts

bridge:
	npx ts-node ./bridgeexec.ts

checkenable:
	@echo goerli
	cast call 0xea49182d6557F8BD20Fe8c56955b337De404166C "isModuleEnabled(address)(bool)" 0xa8F241ea12F8b739b2CB8342B03D94D019aA7aAc --rpc-url https://eth-goerli.public.blastapi.io
	@echo base
	cast call 0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d "isModuleEnabled(address)(bool)" 0x4E059b964778B945E4ae906880974487C907a4c6 --rpc-url https://base-goerli.publicnode.com
	

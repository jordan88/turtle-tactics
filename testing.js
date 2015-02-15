QUnit.module("first");
QUnit.test("myTest", function(assert){
	arse = "ass";
	assert.equal(4, 4, "we did it!");
});
QUnit.module("second");
QUnit.test("inBounds", function(assert){
	assert.ok(arse==="ass", "it really does");
});
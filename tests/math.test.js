const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip', () => {
    expect(calculateTip(10, 0.3)).toBe(13);
});

test('Should calculate total with default tip', () => {
    expect(calculateTip(10)).toBe(12.5);
});


test('Should convert 32F to 0C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});


test('Should convert 0C to 32F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

// tesw

test('Should add 2 numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    });
});

test('Should add 2 numbers async/await', async() => {
    const sum = await add(10, 22);
    expect(sum).toBe(32);
});
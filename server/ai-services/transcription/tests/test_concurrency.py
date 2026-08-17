import asyncio

from concurrency import BoundedConcurrency


def test_admits_up_to_limit_then_rejects():
    async def run():
        guard = BoundedConcurrency(2)
        assert await guard.try_acquire() is True
        assert await guard.try_acquire() is True
        assert await guard.try_acquire() is False

    asyncio.run(run())


def test_release_frees_a_slot():
    async def run():
        guard = BoundedConcurrency(1)
        assert await guard.try_acquire() is True
        assert await guard.try_acquire() is False
        await guard.release()
        assert await guard.try_acquire() is True

    asyncio.run(run())


def test_release_never_goes_negative():
    async def run():
        guard = BoundedConcurrency(1)
        await guard.release()
        assert guard.count == 0

    asyncio.run(run())
